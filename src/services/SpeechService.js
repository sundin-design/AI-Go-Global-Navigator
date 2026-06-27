// SpeechService.js - 语音服务模块
// 支持百度智能云实时语音识别（WebSocket）

class STTAdapterBase {
  constructor(config) {
    this.config = config
  }

  async recognize(audioData) {
    throw new Error('Must implement recognize method')
  }

  getName() {
    return this.constructor.name
  }
}

class BaiduASRAdapter extends STTAdapterBase {
  constructor(config) {
    super(config)
    this.appId = config.appId || ''
    this.appKey = config.apiKey || ''
    this.language = config.language || 'en'
    
    this.wsUrl = config.wsUrl || 'wss://vop.baidu.com/realtime_asr'
    this.websocket = null
    this.isConnected = false
    this.onResultCallback = null
    this.onErrorCallback = null
    this.sn = this.generateSN()
    
    this.audioBuffer = new Float32Array(0)
    this.sendInterval = null
    this.isSending = false
    this.totalBytesSent = 0
    this.sendCount = 0
  }

  generateSN() {
    return 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/x/g, () => 
      Math.floor(Math.random() * 16).toString(16)
    )
  }

  getDevPid() {
    switch (this.language) {
      case 'en':
        return 17372
      case 'zh':
        return 15372
      default:
        return 17372
    }
  }

  connect() {
    return new Promise((resolve, reject) => {
      if (this.websocket && this.isConnected) {
        resolve()
        return
      }

      try {
        console.log('正在连接百度实时语音识别...')
        this.websocket = new WebSocket(`${this.wsUrl}?sn=${this.sn}`)
        this.websocket.binaryType = 'arraybuffer'

        this.websocket.onopen = () => {
          console.log('WebSocket连接成功')
          this.isConnected = true
          this.totalBytesSent = 0
          this.sendCount = 0
          this.sendStartFrame()
          resolve()
        }

        this.websocket.onmessage = (event) => {
          this.handleMessage(event.data)
        }

        this.websocket.onerror = (error) => {
          console.error('WebSocket错误:', error)
          this.isConnected = false
          reject(new Error('WebSocket连接失败'))
        }

        this.websocket.onclose = () => {
          console.log('WebSocket连接已关闭')
          this.isConnected = false
        }

        setTimeout(() => {
          if (!this.isConnected) {
            this.websocket?.close()
            reject(new Error('WebSocket连接超时'))
          }
        }, 10000)

      } catch (error) {
        console.error('创建WebSocket失败:', error)
        reject(error)
      }
    })
  }

  sendStartFrame() {
    if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket未连接，无法发送开始帧')
      return
    }

    const startFrame = {
      type: 'START',
      data: {
        appid: parseInt(this.appId),
        appkey: this.appKey,
        dev_pid: this.getDevPid(),
        cuid: `ai_meeting_${Date.now()}`,
        format: 'pcm',
        sample: 16000
      }
    }

    console.log('发送开始帧:', JSON.stringify(startFrame).substring(0, 100), '...')
    this.websocket.send(JSON.stringify(startFrame))
  }

  sendAudioData(float32Array) {
    if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket未连接，无法发送音频数据')
      return
    }

    const int16Array = new Int16Array(float32Array.length)
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]))
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF
    }

    this.websocket.send(int16Array.buffer)
    
    this.totalBytesSent += int16Array.buffer.byteLength
    this.sendCount++
    console.log(`[发送帧] 第${this.sendCount}帧, ${int16Array.buffer.byteLength}字节, 累计${this.totalBytesSent}字节`)
  }

  sendFinishFrame() {
    if (!this.websocket || this.websocket.readyState !== WebSocket.OPEN) {
      return
    }

    const finishFrame = { type: 'FINISH' }
    console.log('发送结束帧')
    this.websocket.send(JSON.stringify(finishFrame))
  }

  handleMessage(data) {
    try {
      let json
      if (typeof data === 'string') {
        json = JSON.parse(data)
      } else {
        const text = new TextDecoder().decode(data)
        console.log('收到二进制数据:', text.substring(0, 200))
        json = JSON.parse(text)
      }
      
      console.log('收到消息:', json)

      if (json.err_no !== undefined && json.err_no !== 0) {
        let errorMsg = ''
        
        if (json.err_no === -3005) {
          errorMsg = '等待英文发言内容...'
        } else if (json.err_no === -3101) {
          errorMsg = '等待英文发言内容...'
        } else {
          errorMsg = `识别错误: ${json.err_no} - ${json.err_msg || '未知错误'}`
        }
        
        console.error(errorMsg)
        
        if (this.onErrorCallback) {
          const error = new Error(errorMsg)
          error.code = json.err_no
          this.onErrorCallback(error)
        }
        return
      }

      if (json.type === 'FIN_TEXT' && json.result) {
        const text = typeof json.result === 'string' ? json.result : (json.result[0] || '')
        console.log('最终识别结果:', text)
        
        if (this.onResultCallback && text) {
          this.onResultCallback({
            text: text,
            confidence: 0.9,
            isFinal: true,
            start_time: json.start_time,
            end_time: json.end_time
          })
        }
      } else if (json.type === 'MID_TEXT' && json.result) {
        const midText = typeof json.result === 'string' ? json.result : (json.result[0] || '')
        console.log('临时识别结果:', midText)
      } else if (json.type === 'HEARTBEAT') {
        console.log('收到心跳包')
      }

    } catch (error) {
      console.log('收到非JSON数据')
    }
  }

  async startRecognition(onResult, onError) {
    this.onResultCallback = onResult
    this.onErrorCallback = onError
    this.audioBuffer = new Float32Array(0)

    try {
      await this.connect()
      this.startSending()
      return true
    } catch (error) {
      console.error('启动识别失败:', error)
      if (onError) {
        onError(error)
      }
      return false
    }
  }

  processAudioData(float32Array) {
    if (!this.isConnected) return
    
    const newBuffer = new Float32Array(this.audioBuffer.length + float32Array.length)
    newBuffer.set(this.audioBuffer, 0)
    newBuffer.set(float32Array, this.audioBuffer.length)
    this.audioBuffer = newBuffer
  }
  
  startSending() {
    if (this.isSending) return
    this.isSending = true
    
    this.sendInterval = setInterval(() => {
      if (!this.isConnected) return
      
      const targetFrameSize = 640
      const sendSize = Math.min(targetFrameSize, this.audioBuffer.length)
      
      if (sendSize > 0) {
        const frame = this.audioBuffer.slice(0, sendSize)
        this.sendAudioData(frame)
        this.audioBuffer = this.audioBuffer.slice(sendSize)
      }
    }, 40)
  }
  
  stopSending() {
    this.isSending = false
    if (this.sendInterval) {
      clearInterval(this.sendInterval)
      this.sendInterval = null
    }
    
    if (this.audioBuffer.length > 0 && this.isConnected) {
      this.sendAudioData(this.audioBuffer)
      this.audioBuffer = new Float32Array(0)
    }
  }

  stopRecognition() {
    this.stopSending()
    
    if (this.isConnected) {
      this.sendFinishFrame()
      
      setTimeout(() => {
        if (this.websocket) {
          this.websocket.close()
          this.websocket = null
        }
        this.isConnected = false
      }, 2000)
    }
  }

  cancelRecognition() {
    if (this.isConnected) {
      const cancelFrame = { type: 'CANCEL' }
      this.websocket.send(JSON.stringify(cancelFrame))
      
      if (this.websocket) {
        this.websocket.close()
        this.websocket = null
      }
      this.isConnected = false
    }
  }

  disconnect() {
    if (this.websocket) {
      this.websocket.close()
      this.websocket = null
    }
    this.isConnected = false
  }
}

export class STTAdapterFactory {
  static adapters = {
    'baidu': BaiduASRAdapter
  }

  static createAdapter(provider, config) {
    const AdapterClass = this.adapters[provider]
    if (!AdapterClass) {
      console.warn(`不支持的STT服务: ${provider}, 使用百度适配器`)
      return new BaiduASRAdapter(config)
    }
    return new AdapterClass(config)
  }

  static getSupportedProviders() {
    return Object.keys(this.adapters)
  }
}

export class AudioCapture {
  constructor() {
    this.mediaStream = null
    this.audioContext = null
    this.scriptProcessor = null
    this.isCapturing = false
    this.onAudioDataCallback = null
    this.actualSampleRate = 16000
  }

  async startCapture() {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          channelCount: 1
        }
      })

      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
      this.actualSampleRate = this.audioContext.sampleRate
      console.log(`AudioContext创建成功，实际采样率: ${this.actualSampleRate}Hz`)
      
      const source = this.audioContext.createMediaStreamSource(this.mediaStream)

      this.scriptProcessor = this.audioContext.createScriptProcessor(4096, 1, 1)
      source.connect(this.scriptProcessor)
      this.scriptProcessor.connect(this.audioContext.destination)

      this.scriptProcessor.onaudioprocess = (event) => {
        if (this.onAudioDataCallback && this.isCapturing) {
          const audioData = event.inputBuffer.getChannelData(0)
          console.log(`[采集] 收到${audioData.length}个采样点`)
          
          let processedData = audioData
          if (this.actualSampleRate !== 16000) {
            processedData = this.resample(audioData, this.actualSampleRate, 16000)
            console.log(`[重采样] ${this.actualSampleRate}Hz -> 16000Hz, ${audioData.length} -> ${processedData.length}采样点`)
          }
          
          this.onAudioDataCallback(processedData)
        }
      }

      this.isCapturing = true
      return { success: true, message: '麦克风采集已启动', sampleRate: this.actualSampleRate }
    } catch (error) {
      console.error('麦克风采集失败:', error)
      if (error.name === 'NotAllowedError') {
        throw new Error('麦克风权限被拒绝，请在浏览器设置中允许麦克风访问')
      } else if (error.name === 'NotFoundError') {
        throw new Error('未找到麦克风设备，请检查设备连接')
      } else {
        throw new Error(`麦克风采集失败: ${error.message}`)
      }
    }
  }

  resample(inputBuffer, sourceSampleRate, targetSampleRate) {
    if (sourceSampleRate === targetSampleRate) {
      return inputBuffer
    }

    const ratio = targetSampleRate / sourceSampleRate
    const outputLength = Math.floor(inputBuffer.length * ratio)
    const outputBuffer = new Float32Array(outputLength)

    for (let i = 0; i < outputLength; i++) {
      const sourceIndex = i / ratio
      const floorIndex = Math.floor(sourceIndex)
      const ceilIndex = Math.min(floorIndex + 1, inputBuffer.length - 1)
      const fraction = sourceIndex - floorIndex

      outputBuffer[i] = inputBuffer[floorIndex] * (1 - fraction) + inputBuffer[ceilIndex] * fraction
    }

    return outputBuffer
  }

  pauseCapture() {
    this.isCapturing = false
  }

  resumeCapture() {
    this.isCapturing = true
  }

  stopCapture() {
    this.isCapturing = false
    
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop())
      this.mediaStream = null
    }
    
    if (this.scriptProcessor) {
      this.scriptProcessor.disconnect()
      this.scriptProcessor = null
    }
    
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
  }

  setOnAudioDataCallback(callback) {
    this.onAudioDataCallback = callback
  }

  getState() {
    return {
      isCapturing: this.isCapturing,
      hasMicrophone: this.mediaStream !== null,
      audioContextState: this.audioContext?.state || 'closed',
      actualSampleRate: this.actualSampleRate
    }
  }
}

export class SpeechService {
  constructor() {
    this.audioCapture = null
    this.sttAdapter = null
    this.currentProvider = 'baidu'
    this.isInitialized = false
    this.isListening = false
    this.onRecognitionResultCallback = null
    this.onErrorCallback = null
  }

  async initialize(provider = 'baidu', config = {}) {
    this.currentProvider = provider
    const sttConfig = this.getProviderConfig(provider, config)
    this.sttAdapter = STTAdapterFactory.createAdapter(provider, sttConfig)
    this.audioCapture = new AudioCapture()
    this.isInitialized = true
    return { success: true, provider: provider }
  }

  getProviderConfig(provider, userConfig) {
    const defaultConfigs = {
      'baidu': {
        appId: import.meta.env.VITE_BAIDU_APP_ID || '',
        apiKey: import.meta.env.VITE_BAIDU_API_KEY || '',
        language: 'en',
        wsUrl: '/baidu-ws/realtime_asr'
      }
    }

    return { ...defaultConfigs[provider], ...userConfig }
  }

  async startListening() {
    if (!this.isInitialized) {
      throw new Error('SpeechService未初始化')
    }

    try {
      await this.audioCapture.startCapture()
      this.isListening = true

      if (this.sttAdapter && typeof this.sttAdapter.startRecognition === 'function') {
        await this.sttAdapter.startRecognition(
          (result) => this.handleRecognitionResult(result),
          (error) => this.handleError(error)
        )

        this.audioCapture.setOnAudioDataCallback((audioData) => {
          if (this.isListening && this.sttAdapter) {
            this.sttAdapter.processAudioData(audioData)
          }
        })
      }

      return { success: true, message: '开始监听' }
    } catch (error) {
      this.handleError(error, 'startListening')
      throw error
    }
  }

  handleRecognitionResult(result) {
    if (this.onRecognitionResultCallback && result.text) {
      this.onRecognitionResultCallback({
        text: result.text,
        confidence: result.confidence,
        isFinal: result.isFinal,
        timestamp: new Date().toISOString()
      })
    }
  }

  pauseListening() {
    if (this.audioCapture) {
      this.audioCapture.pauseCapture()
      this.isListening = false
    }
    
    if (this.sttAdapter && typeof this.sttAdapter.stopRecognition === 'function') {
      this.sttAdapter.stopRecognition()
    }
  }

  async resumeListening() {
    if (this.audioCapture) {
      this.audioCapture.resumeCapture()
      this.isListening = true
    }
    
    if (this.sttAdapter && typeof this.sttAdapter.startRecognition === 'function') {
      await this.sttAdapter.startRecognition(
        (result) => this.handleRecognitionResult(result),
        (error) => this.handleError(error, 'resumeRecognition')
      )
    }
  }

  stopListening() {
    this.isListening = false
    
    if (this.audioCapture) {
      this.audioCapture.stopCapture()
    }
    
    if (this.sttAdapter && typeof this.sttAdapter.stopRecognition === 'function') {
      this.sttAdapter.stopRecognition()
    }
  }

  async processManualInput(text) {
    if (this.onRecognitionResultCallback) {
      this.onRecognitionResultCallback({
        text: text,
        confidence: 1.0,
        isFinal: true,
        timestamp: new Date().toISOString(),
        isManual: true
      })
    }
  }

  onRecognitionResult(callback) {
    this.onRecognitionResultCallback = callback
  }

  onError(callback) {
    this.onErrorCallback = callback
  }

  handleError(error, operation) {
    const errorInfo = {
      operation: operation,
      message: error.message,
      type: this.classifyError(error),
      timestamp: new Date().toISOString()
    }

    console.error('SpeechService错误:', errorInfo)

    if (this.onErrorCallback) {
      this.onErrorCallback(errorInfo)
    }
  }

  classifyError(error) {
    const message = error.message.toLowerCase()

    if (message.includes('permission') || message.includes('denied') || message.includes('拒绝')) {
      return 'permission'
    } else if (message.includes('network') || message.includes('fetch') || message.includes('api') || message.includes('cors') || message.includes('websocket')) {
      return 'network'
    } else if (message.includes('device') || message.includes('not found') || message.includes('未找到')) {
      return 'device'
    } else {
      return 'recognition'
    }
  }

  getState() {
    return {
      isInitialized: this.isInitialized,
      isListening: this.isListening,
      currentProvider: this.currentProvider,
      audioCaptureState: this.audioCapture?.getState() || null,
      supportedProviders: STTAdapterFactory.getSupportedProviders()
    }
  }

  async switchProvider(newProvider, config = {}) {
    this.currentProvider = newProvider
    const sttConfig = this.getProviderConfig(newProvider, config)
    this.sttAdapter = STTAdapterFactory.createAdapter(newProvider, sttConfig)
    return { success: true, provider: newProvider }
  }

  destroy() {
    this.isListening = false
    
    if (this.audioCapture) {
      this.audioCapture.stopCapture()
      this.audioCapture = null
    }
    
    if (this.sttAdapter && typeof this.sttAdapter.disconnect === 'function') {
      this.sttAdapter.disconnect()
    }
    
    this.sttAdapter = null
    this.isInitialized = false
  }
}

export default SpeechService
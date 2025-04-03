package com.reactnativeshell

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import java.io.InputStream
import java.io.OutputStream
import java.nio.charset.Charset

class ShellModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "Shell"
    }

    @ReactMethod
    fun shell(root:Boolean,command: String, promise: Promise) {
        var process: Process? = null
        var outputStream: OutputStream?=null
        var inputStream: InputStream?=null
        var errorStream: InputStream?=null
        var sCommand="su"
        if(root==false){
            sCommand="sh"
        }

        try {
            var process = Runtime.getRuntime().exec(sCommand)
            outputStream = process?.outputStream
            inputStream = process?.inputStream
            errorStream = process?.errorStream
            outputStream?.write(command.toByteArray())
            outputStream?.write("\n".toByteArray());
            outputStream?.flush()
            outputStream?.close()
            process?.waitFor()
            if (process?.exitValue() != 0) {
                var r = errorStream?.readBytes()!!.toString(Charset.defaultCharset())
                promise.reject(r)
            } else {
                var bs = inputStream?.readBytes()
                var r = bs?.toString(Charset.defaultCharset())
                promise.resolve(r)
            }
        } catch (e: Exception) {
            promise.reject(e)
        } finally {
            errorStream?.close()
            inputStream?.close()
            if (process != null) {
                process?.destroy()
            }
        }
    }
    @ReactMethod
    fun shellRaw(command: String, promise: Promise) {
        var process: Process? = null
        var outputStream: OutputStream?=null
        var inputStream: InputStream?=null
        var errorStream: InputStream?=null
        var sCommand=command

        try {
            var process = Runtime.getRuntime().exec(sCommand)
            outputStream = process?.outputStream
            inputStream = process?.inputStream
            errorStream = process?.errorStream
//            outputStream?.write(command.toByteArray())
//            outputStream?.write("\n".toByteArray());
            outputStream?.flush()
            outputStream?.close()
            process?.waitFor()
            if (process?.exitValue() != 0) {
                var r = errorStream?.readBytes()!!.toString(Charset.defaultCharset())
                promise.reject(r)
            } else {
                var bs = inputStream?.readBytes()
                var r = bs?.toString(Charset.defaultCharset())
                promise.resolve(r)
            }
        } catch (e: Exception) {
            promise.reject(e)
        } finally {
            errorStream?.close()
            inputStream?.close()
            if (process != null) {
                process?.destroy()
            }
        }
    }
}

import * as net from 'net';
  import {
    CombinerError_InvalidRequest,
    CombinerError_InvalidStocks,
    CombinerHost,
    CombinerPort
  } from './App/Services/Combiner/CombinerConstants';
  import {
    CombinerRequest
  } from './App/Services/Combiner/CombinerInterfaces';

export default class CombinerService{
    // Send a request over network socket to the combiner backend. Make sure the backend is running before you try to use this function.
    // Note that the combiner uses socket 27015.
    public static async sendCombinerRequest<ResponseType>(request: CombinerRequest): Promise<ResponseType> {
        return new Promise<ResponseType>(async (resolve, reject) => {
            const socket = net.createConnection(CombinerPort, CombinerHost);
            let responseBuffer: string = '';

            socket.on('connect', () => {
                try {
                    // Add the null terminator (the combiner requires its requests to be null-terminated, sorry!):
                    socket.write(JSON.stringify(request) + '\u0000')
                } catch (error) {
                    reject(error)
                }
            })

            socket.on('data', (chunk: Buffer) => {
                try {
                responseBuffer += chunk;
                socket.end();
                } catch (error) {
                    reject(error)
                }
            });
        
            socket.on('end', () => {
                try {
                responseBuffer = responseBuffer.slice(0, -1); // Remove null terminator so JSON.parse will work
                // If we get this message back from the combiner, then we've sent invalid stock names to the backend
                // during one of the request types that use stocks (like getCombinations)
                if (responseBuffer === CombinerError_InvalidStocks) {
                    console.log("invalid stocks requested")
                    return;
                }
                // If we get this message back then our request was simply not valid
                if (responseBuffer === CombinerError_InvalidRequest) {
                    console.log("invalid request lol")
                    return;
                }
        
                const response: ResponseType = JSON.parse(responseBuffer);
                console.log("Resolved request.")
                resolve(response)
                } catch (error) {
                    reject(error)
                }
            });
        })
    }
}
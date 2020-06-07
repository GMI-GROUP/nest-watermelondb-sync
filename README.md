### WatermelonDB - NestJS - Synchronization Module

WatermelonDB is a reactive database framework for React and React Native applications. 
We have used it in projects that required offline first approach for mobile applications.


However, WatermelonDB does only handle the web/mobile side of things. 
It does not supply any of the backend code needed to make synchronization happen. 
This allows devs to use any backend they want, but also means that the same code would 
have to be written multiple times.


This repository shows the backend synchronization code for NestJS applications.

Module import:
`
    WatermellondbSynchronizationModule.register({
      readEntities: [Power],
      writeEntities: [],
    })
`

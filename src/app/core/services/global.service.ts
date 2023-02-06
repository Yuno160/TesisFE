import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver'
@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor() { }

  cvsDownload(headers:any, globalData:any){
    if(!globalData || !globalData.length){
        return;
    }
    const separator = ',';
    const csvContent: any = 
        headers.join(separator)+
        '\n'+
        globalData
        .map((rowData:any)=>{
            return headers
            .map((headKey:any) => {
                return rowData[headKey.toLowerCase().replaceAll(' ','-')]
                ===
                null ||
                rowData[headKey.toLowerCase().replaceAll(' ', '-')]===
                undefined
                ? ''
                :rowData[headKey.toLowerCase().replaceAll(' ','-')];
            })
            
            .join(separator);
        })
        .join('\n');
            this.exportFile(csvContent, 'text/csv');
}

exportFile(data:any, fileType:string){
    const blob = new Blob([data],{type:fileType});
    FileSaver.saveAs(blob, 'Downloaded CSV')
}
}

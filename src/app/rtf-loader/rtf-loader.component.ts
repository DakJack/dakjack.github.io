import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';

@Component({
  selector: 'app-rtf-loader',
  templateUrl: './rtf-loader.component.html',
  styleUrls: ['./rtf-loader.component.scss']
})
export class RtfLoaderComponent implements OnInit {

  constructor(private rest: RestService) { }

  ngOnInit() {
    //'assets/articles/Plants_Article.rtf'
   // let fileReader: FileReader = new FileReader();


    var request = new XMLHttpRequest();
    request.open('GET', "assets/articles/Plants_Article.rtf", true);
    request.responseType = 'blob';
    request.onload = function() {
    var reader = new FileReader();
        reader.readAsDataURL(request.response);
        reader.onload =  function(e:any){
        console.log('DataURL:', e.target.result);

        // rtfToHtml.fromString(e.target.result, (err, html) => {
        //   console.log(html);
        // });
    };
};
request.send();
  }

}

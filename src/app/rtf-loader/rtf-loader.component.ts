import { Component, OnInit } from '@angular/core';
import { RestService } from '../rest.service';
import * as mammoth from 'mammoth/mammoth.browser';
import * as base64Convert from 'base64-arraybuffer';

@Component({
  selector: 'app-rtf-loader',
  templateUrl: './rtf-loader.component.html',
  styleUrls: ['./rtf-loader.component.scss']
})
export class RtfLoaderComponent implements OnInit {
  private articlesJson: any[];
  public htmlArticles: any[] = [];
  constructor(private rest: RestService) { }

  ngOnInit() {
    let local = this;
    //'assets/articles/Plants_Article.rtf'
    fetch("assets/articles/articles.json")
    .then(res => res.json())
    .then(data => {
      this.articlesJson = data;

      this.articlesJson.forEach((article) => {
        local.getDocxHtml("assets/articles/" + article.fileName)
        .then((data) => {
          let returnArticle = {'title': article.title, 'body': data};
          local.htmlArticles.push(returnArticle);
        });
      });
    });

   
  }

  private getDocxHtml(ref): Promise<any> {
    return new Promise((resolve, reject) => {
      fetch("assets/articles/Plants_Article.docx")
      .then(res => res.arrayBuffer())
      .then(buffer => {
        mammoth.convertToHtml({ arrayBuffer: buffer })
            .then(function (result) {
             // var html = result.value; // The generated HTML
              resolve(result.value);
             // var messages = result.messages; // Any messages, such as warnings during conversion
            })
            .done();
      });
    });
  }
}

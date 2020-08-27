import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Field } from './model/Field';
import {Coordinate} from './model/Coordinate'
import { Test } from './model/Tets';
import { GmapService } from './services/gmap.service';
import { ThrowStmt } from '@angular/compiler';

declare const google: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  latitude = 45.267136;
  longitude = 19.833549;
  locationChosen = false;
  lastSelected:any;
  selected: any;
  shapes : any[] = [];
  test : any;
  podaci :Test = new Test();
  newFields: Array<Array<Coordinate>> = [];
  field:Field = new Field();
  fields: Field[] = [];
  paths: Array<Array<Coordinate>> =  [];
  flag:boolean = false;
  info:any;
  novaPolja:Field[] = [];
  map:any;

  constructor(private http:HttpClient, private gmapService:GmapService){}

    ngOnInit(){
      this.podaci.type = "Feature";
      this.podaci.geometry.type = "Polygon";
      this.http.get("http://localhost:8080/field/getAll").subscribe(data=>{
        this.test = data;
        this.test.forEach(element => {
          this.podaci.geometry.coordinates.push(element.coords);
          this.paths.push(element.coords);
        });
        this.flag = true;
      })
    }

  onChoseLocation(event){
   /* this.latitude = event.coords.lat;
    this.longitude = event.coords.lng;
    this.locationChosen = true;*/
    /*var marker = new google.maps.Marker({
      position: event.coords,
      map: this.map,
      title: 'Hello World!'
    });*/
    if(this.lastSelected != null){
      this.lastSelected.setOptions({
        editable:false
      })
    }
    this.lastSelected = null;
  }

  onMapReady(map) {
    this.map = map;
    var trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);
    this.initDrawingManager(map);
    var infowindow = new google.maps.InfoWindow();
    var coutner = 0;
    console.log(this.test)
    this.test.forEach(element => {
      console.log(element)
      var polygon = new google.maps.Polygon({
        paths:element.coords,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        editable:false
      })
      google.maps.event.addListener(polygon, 'click', (event)=> {
        polygon.setOptions({
          editable:true
        })
        if(this.lastSelected != null){
          console.log("Usao");
          this.lastSelected.setOptions({
            editable:false
          })
        }
        if(this.info != null){
          this.info.close();
        }
        this.lastSelected = polygon;
        var contentString = "Naziv:<b>"+element.name+"</b><br>Posejano:<b>" +element.cereals+'</b>';
        infowindow.setContent(contentString);
        infowindow.setPosition(event.latLng);
        infowindow.open(map);
        this.info = infowindow;
      });

      google.maps.event.addListener(polygon, 'dblclick', (event)=> {
        this.lastSelected = null;
        this.http.delete("http://localhost:8080/field/delete/"+element.id).subscribe(res=>{
          polygon.setMap(null);
          this.info.close();
        })
      });
      polygon.setMap(map);
      coutner++;
    });
  }

  initDrawingManager(map: any) {
    var testVar;
    const options = {
      indexID: 1,
      drawingControl: true,
      drawingControlOptions: {
        drawingModes: ["polygon"]
      },
      polygonOptions: {
        draggable: false,
        editable: true,
        fillColor: '#fffb00',
        fillOpacity: 0.3,
        strokeOpacity: 0.8,
        strokeWeight: 2
      },
      drawingMode: google.maps.drawing.OverlayType.POLYGON
    };

    
    const drawingManager = new google.maps.drawing.DrawingManager(options);

    google.maps.event.addListener(drawingManager, 'overlaycomplete', (e) =>{
      var infowindow = new google.maps.InfoWindow();
      console.log(e)
      var newShape = e.overlay;
      newShape.type = e.type;
      newShape.counter = this.novaPolja.length;
      if(this.lastSelected != null){
        this.lastSelected.setOptions({
          editable:false
        })
      }
      this.lastSelected = newShape;
      this.getCoords(newShape);
      google.maps.event.addListener(newShape,'click',(e) =>{
        console.log(this.lastSelected)
        if(this.lastSelected != null){
          this.lastSelected.setOptions({
            editable: false,
          });
        }
        testVar = newShape;
        if(this.info != null){
          this.info.close();
        }
        var contentString = "Naziv:<b>"+this.novaPolja[newShape.counter].name+"</b><br>Posejano:<b>" +this.novaPolja[newShape.counter].cereals+'</b>';
        infowindow.setContent(contentString);
        infowindow.setPosition(e.latLng);
        infowindow.open(map);
        this.info = infowindow;
        newShape.setOptions({
          editable: true,
        });
        this.lastSelected = newShape;
      });
      google.maps.event.addListener(newShape, 'dblclick', (event)=> {
        this.lastSelected = null;
        this.http.delete("http://localhost:8080/field/delete/"+this.novaPolja[newShape.counter].id).subscribe(res=>{
          newShape.setMap(null);
          this.info.close();
        })
      });
      console.log(newShape)
      this.shapes.push(newShape);
    })
    drawingManager.setMap(map);
  }

  public getCoords(shape){
    var path = shape.getPath();
      var coords = [];
      for (var i = 0; i < path.length; i++) {
        coords.push({
          lat: path.getAt(i).lat(),
          lng: path.getAt(i).lng()
        });
      }
      this.newFields.push(coords);
      this.field.coords = coords;
      document.getElementById("openModalButton").click();
  }
  saveData(){
    if(this.newFields.length == 0){
      alert("Sva polja su sačuvana!")
    }else{
      this.newFields.forEach(element => {
        var field :Field = new Field();
        field.coords = element;
        field.name = 'name';
        field.cereals = 'psennica';
        this.http.post("http://localhost:8080/field/create", field).subscribe(data=>{
        })
      });
    }
    this.newFields = [];
  }

  deletePolygon(){
    var infowindow = new google.maps.InfoWindow();
    if(this.lastSelected==null){
      alert("Označite polje za brisanje.")
    }else{
      this.lastSelected.setMap(null);
      this.lastSelected = null;
      this.info.close();
    }
  }

  addField(){
    
    this.gmapService.createField(this.field).subscribe(data=>{
        this.field = data;
        this.novaPolja.push(this.field);
        console.log(this.novaPolja);
        this.field = new Field();
    })
  }

  dropField(){
    this.lastSelected.setMap(null);
    this.lastSelected = null;
  }
}

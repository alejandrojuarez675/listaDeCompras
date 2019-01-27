import { Component, Inject, Injectable } from '@angular/core';
import { Dialogs } from '@ionic-native/dialogs/ngx';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  lista: Item[] = new Array;

  constructor(
    public dialog: MatDialog, 
    private dialogs: Dialogs,
    private storage: Storage
    ) {
      this.storage.keys().then( keys =>{
        keys.forEach( k => {
          this.storage.get(k).then( item => {
            this.lista.push(item);
          });
        });
      }).catch( x => {
        this.lista = new Array;
      });
  }

  onAdd() {
    this.dialogs.prompt("Que desea agregar?", "Add", [], "").then(dat => {
      let itemAux = new Item((this.lista.length + 1), dat.input1);
      this.lista.push(itemAux);
      this.storage.set(itemAux.codigo.toString(), itemAux);
    }).catch(e => console.log('Error displaying dialog', e));

  }

  onDelete(codigo: number) {
    let listaAux: Item[] = new Array;
    let cont = 1;
    this.storage.clear();
    this.lista.forEach(element => {
      if (element.codigo != codigo) {
        element.codigo = cont;
        listaAux.push(element);
        this.storage.set(cont.toString(), element);
        cont++;
      }
    });
    this.lista = listaAux;
  }

}

export class Item {
  codigo: number;
  descripcion: string;

  constructor(codigo, descripcion) {
    this.codigo = codigo;
    this.descripcion = descripcion;
  }
}
/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PackingComponent } from './packing.component';

describe('PackingComponent', () => {
  let component: PackingComponent;
  let fixture: ComponentFixture<PackingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

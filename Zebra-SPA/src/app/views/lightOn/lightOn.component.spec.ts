/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LightOnComponent } from './lightOn.component';

describe('LightOnComponent', () => {
  let component: LightOnComponent;
  let fixture: ComponentFixture<LightOnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LightOnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LightOnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

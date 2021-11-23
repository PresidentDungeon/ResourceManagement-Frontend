import { NO_ERRORS_SCHEMA } from "@angular/core";
import { RequestComponent } from "./request.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("RequestComponent", () => {

  let fixture: ComponentFixture<RequestComponent>;
  let component: RequestComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [RequestComponent]
    });

    fixture = TestBed.createComponent(RequestComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});

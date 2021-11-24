import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ResumeOverviewComponent } from "./resume-overview.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("ResumeOverviewComponent", () => {

  let fixture: ComponentFixture<ResumeOverviewComponent>;
  let component: ResumeOverviewComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [ResumeOverviewComponent]
    });

    fixture = TestBed.createComponent(ResumeOverviewComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});

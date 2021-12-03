import { NO_ERRORS_SCHEMA } from "@angular/core";
import { WhitelistComponent } from "./whitelist.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

describe("WhitelistComponent", () => {

  let fixture: ComponentFixture<WhitelistComponent>;
  let component: WhitelistComponent;
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
      ],
      declarations: [WhitelistComponent]
    });

    fixture = TestBed.createComponent(WhitelistComponent);
    component = fixture.componentInstance;

  });

  it("should be able to create component instance", () => {
    expect(component).toBeDefined();
  });
  
});

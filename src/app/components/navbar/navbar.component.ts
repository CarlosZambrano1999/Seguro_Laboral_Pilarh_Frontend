import { Component, OnInit } from '@angular/core';
import { faFileLines, faHome, faBookOpen, faPeopleGroup, faRightFromBracket} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  faFileLines = faFileLines
  faHome = faHome
  faBookOpen = faBookOpen
  faPeopleGroup = faPeopleGroup
  faOut = faRightFromBracket
  constructor() { }

  ngOnInit(): void {
  }

}

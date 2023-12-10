import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { Member } from 'src/app/_models/member';
import { MembersService } from 'src/app/_services/members.service';
import { GalleryItem, GalleryModule,ImageItem } from 'ng-gallery';

@Component({
  selector: 'app-member-details',
  standalone : true, //standalone means we are not using app.module or shared module
  imports: [CommonModule,TabsModule,GalleryModule], // we are not using imports from app.module so we need to import it manually
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent {
  member : Member | undefined;
  images : GalleryItem[] = [];

  constructor(private memberService : MembersService , private route : ActivatedRoute){}

  ngOnInit() : void 
  {
    this.LoadMember();
  }

  LoadMember()
  {
    var username = this.route.snapshot.paramMap.get('username');
    if(!username) return;
    this.memberService.getMember(username).subscribe({
      next : member => 
      {this.member = member,
        this.getImages()
      }
    })
  }


  getImages()
  {
    if(!this.member) return;
    for(const photo of this.member?.photos){
      this.images.push(new ImageItem({src : photo.url , thumb : photo.url}));
    }
  }

}

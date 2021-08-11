import { Controller, Get, Body, Query, Put, Patch } from '@nestjs/common';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  findProfileByIntraId(@Query() para) {
    const { myID, otherID } = para;
    return this.profileService.findProfileById(myID, otherID);
  }

  @Get('allblock')
  getBlock(@Query() para) {
    return this.profileService.getBlock(para.myID);
  }

  @Put('friend')
  addFriend(@Body() body) {
    const { myID, otherID, isFriend } = body;
    return this.profileService.addFriend(myID, otherID, isFriend);
  }

  @Put('block')
  addBlock(@Body() body) {
    const { myID, otherID, isBlock } = body;
    return this.profileService.addBlock(myID, otherID, isBlock);
  }

  @Get('my')
  findMyProfile(@Query() para) {
    const { intra_id } = para;
    return this.profileService.findMyProfile(intra_id);
  }

  @Patch('userState')
  setUserState(@Body() body) {
    const { id, state } = body;
    return this.profileService.setUserState(id, state);
  }

  // behind functions are for develop
  @Get('all')
  findAll() {
    // console.log('find all');
    return this.profileService.findAll();
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import axios from 'axios';
import * as FormData from 'form-data';
// import FormData from 'form-data';

@Injectable()
export class LogInOutService {
  constructor(private readonly usersService: UsersService) {}
  parseAxios = (v) => {
    if (v.request) {
      // console.log(v);
      console.log(v.request._header);
      console.log(v.response.data);
    }
    return v;
  };
  async login(code: string) {
    const url = 'https://api.intra.42.fr/oauth/token';
    const client_id =
      'bdfe71f0d292f9a780b44094736aaf3f844a65813080ff82b60e00bb29143d01';
    const client_secret =
      'b9d5dd431d885957f350bd14a3410514963c1383b2874071399d67cc6345549f';
    const formData = new FormData();
    formData.append('grant_type', 'client_credentials');
    formData.append('client_id', client_id);
    formData.append('client_secret', client_secret);
    formData.append('code', code);
    axios.interceptors.request.use((request) => {
      const { url } = request;
      console.log(url);
      console.log('Starting Request', request);
      return request;
    });
    const result = await axios
      .post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data;',
        },
      })
      .then((v) => {
        this.parseAxios(v);
        return v;
      })
      .catch((error) => {
        this.parseAxios(error);
        return error;
      });
    // console.log(result);
    return 'result';
  }

  async findByIntraId(intra_id: string) {}

  async findByNickname(nickname: string) {}

  //   async update(updateUserDto: UpdateUsersDto) {}

  async addFriend(myID: string, otherID: string) {}

  async addBlock(myID: string, otherID: string) {}

  async remove(nickname: string) {}

  async clear() {}

  // helper functions

  //   duplicateCheck = async (field: string, target: object, value: string) => {
  //     const result = await this.usersRepository.findOne(target);
  //     if (result) {
  //       const error = `${field}: ${value} is already exist`;
  //       throw new AlreadyExistException(error);
  //     }
  //     return result;
  //   };

  //   existCheck = async (field: string, target: object, value: string) => {
  //     const result = await this.usersRepository.findOne(target);
  //     if (result === undefined) {
  //       const error = `${field}: ${value} is not exist`;
  //       throw new NotExistException(error);
  //     }
  //     return result;
  //   };
}

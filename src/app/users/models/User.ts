import { IUserProfile } from './IUserProfile';
import { UserEducation } from './UserEducation';

export class User {
  id: number;
  name: string;
  email: string;
  surname: string;
  password: string;
  type: string;
  activities: Array<number> = [];
  profile: IUserProfile;
  education: Array<UserEducation> = [];
}

export type RoleType = "" | "*" | "admin" | "user";
export type RoleId = 10 | 11 | 12;

export interface UserState {
  username?: string;
  avatar?: string;
  job?: string;
  organization?: string;
  location?: string;
  email?: string;
  introduction?: string;
  personalWebsite?: string;
  jobName?: string;
  organizationName?: string;
  locationName?: string;
  phone?: string;
  registrationDate?: string;
  accountId?: string;
  certification?: number;
  role: RoleType;
  roleId?: RoleId;
  nickname?: string;
  college?: string;
  department?: string;
  title?: string;
  employeeId?: string;
  profile?: string;
}

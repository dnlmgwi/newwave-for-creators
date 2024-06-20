import { RoleCan } from "../enums/RoleCan";
import { UserRole } from "../enums/UserRole";

type RolePermissions = {
  [role in UserRole]: RoleCan[];
};

type Location = {
  latitude: number;
  longitude: number;
};

type AllowedArea = {
  latitude: number;
  longitude: number;
  radius: number;
};

export type { RolePermissions, Location, AllowedArea };

import axios from 'axios';
import { HttpRequest } from 'axios-core';
import { options, storage } from 'uione';
import { AuditClient } from './audit-log';
import { AuditLogService } from './audit-log/audit-log';
import { MasterDataClient, MasterDataService } from './master-data';
import { RoleClient, RoleService } from './role';
import { CinemaClient, CinemaService } from './cinema';

export * from './role';
export * from './cinema';
export * from './audit-log';
axios.defaults.withCredentials = true;

const httpRequest = new HttpRequest(axios, options);
export interface Config {
  cinema_url: string;
  role_url: string;
  privilege_url: string;
  audit_log_url: string;
}
class ApplicationContext {
  roleService?: RoleClient;
  cinemaService?: CinemaService;
  masterDataService?: MasterDataService;
  private auditService?: AuditClient;
  constructor() {
    this.getConfig = this.getConfig.bind(this);
    this.getRoleService = this.getRoleService.bind(this);
    this.getCinemaService = this.getCinemaService.bind(this);
    this.getMasterDataService = this.getMasterDataService.bind(this);
  }
  getConfig(): Config {
    return storage.config();
  }
  getRoleService(): RoleService {
    if (!this.roleService) {
      const c = this.getConfig();
      this.roleService = new RoleClient(httpRequest, c.role_url, c.privilege_url);
    }
    return this.roleService;
  }
  getCinemaService(): CinemaService {
    if (!this.cinemaService) {
      const c = this.getConfig();
      console.log('cinema_url ', c.cinema_url)
      this.cinemaService = new CinemaClient(httpRequest, c.cinema_url);
    }
    return this.cinemaService;
  }
  getMasterDataService(): MasterDataService {
    if (!this.masterDataService) {
      this.masterDataService = new MasterDataClient();
    }
    return this.masterDataService;
  }
  getAuditService(): AuditClient {
    if (!this.auditService) {
      const c = this.getConfig();
      this.auditService = new AuditClient(httpRequest, c.audit_log_url);
    }
    return this.auditService;
  }
}

export const context = new ApplicationContext();
export function useRole(): RoleService {
  return context.getRoleService();
}
export function useCinema(): CinemaService {
  return context.getCinemaService();
}
export function useMasterData(): MasterDataService {
  return context.getMasterDataService();
}
export function useAuditLog(): AuditLogService {
  return context.getAuditService();
}

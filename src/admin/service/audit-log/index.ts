import { HttpRequest, ViewSearchClient } from 'web-clients';
import { AuditLog, AuditLogFilter, auditLogModel, AuditLogService } from './audit-log';

export * from './audit-log';

export class AuditClient extends ViewSearchClient<AuditLog, string, AuditLogFilter> implements AuditLogService {
  constructor(http: HttpRequest, url: string) {
    super(http, url, auditLogModel);
  }
}

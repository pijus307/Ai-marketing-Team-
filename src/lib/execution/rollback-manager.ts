/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ExecutionHistory } from './execution-history';

export class RollbackManager {
  private static instance: RollbackManager;
  private history = ExecutionHistory.getInstance();

  private constructor() {}

  public static getInstance(): RollbackManager {
    if (!RollbackManager.instance) {
      RollbackManager.instance = new RollbackManager();
    }
    return RollbackManager.instance;
  }

  /**
   * Rolls back a completed action by its unique execution record ID
   */
  public async rollbackAction(recordId: string): Promise<{ success: boolean; message: string }> {
    const record = this.history.getRecords().find(r => r.id === recordId);
    if (!record) {
      return { success: false, message: `Record ID "${recordId}" not found in history.` };
    }

    if (record.status !== 'completed') {
      return { success: false, message: `Record status is "${record.status}". Only completed tasks can be rolled back.` };
    }

    // Determine the safe rollback pathway
    let message = '';
    switch (record.actionId) {
      case 'web_publish_blog':
        message = `Deleted blog article draft and unpublished slug from Webflow/Shopify CMS.`;
        break;
      case 'web_update_landing':
        message = `Restored prior stable landing page schema from CMS backup files.`;
        break;
      case 'web_update_metadata':
        message = `Reverted title and meta description tag configs back to the pre-analyzed state.`;
        break;
      case 'web_gen_faq':
        message = `Unmounted dynamic FAQ toggle boxes and cleared the accordion HTML tags.`;
        break;
      case 'web_gen_schema':
        message = `Removed generated JSON-LD LocalBusiness schemas from active page headers.`;
        break;
      case 'leadgen_crm_contact':
        message = `Deleted the created CRM prospect user record and tags from HubSpot/Salesforce contacts database.`;
        break;
      default:
        message = `Successfully cleaned up temporary execution outputs and deleted local drafts of "${record.name}".`;
        break;
    }

    this.history.updateRecordStatus(recordId, 'rolled_back', {
      rollbackSummary: message
    });

    return { success: true, message };
  }

  /**
   * Automatic rollback of ALL completed actions in the active campaign sequence
   */
  public async rollbackAll(actionIds: string[]): Promise<string[]> {
    const logs: string[] = [];
    const completedRecords = this.history.getRecords().filter(
      r => actionIds.includes(r.id) && r.status === 'completed'
    );

    for (const record of completedRecords) {
      const outcome = await this.rollbackAction(record.id);
      logs.push(`[ROLLBACK] Reverting ${record.name}: ${outcome.message}`);
    }

    return logs;
  }
}

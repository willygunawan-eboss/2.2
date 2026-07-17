import { IProcessCoordinator } from '../../../../platform/process/IProcessCoordinator';
import { ProcessContext } from '../../../../platform/process/ProcessContext';
import { ProcessResult } from '../../../../platform/process/ProcessResult';
import { PostingApplicationService } from '../PostingApplicationService';

export interface PostJournalRequest {
  journalEntryId: string;
  ledgerId: string;
}

export interface PostJournalResponse {
  batchId: string;
  status: string;
}

export class PostJournalCoordinator implements IProcessCoordinator<PostJournalRequest, PostJournalResponse> {
  constructor(private postingService: PostingApplicationService) {}

  public async execute(request: PostJournalRequest, context: ProcessContext): Promise<ProcessResult<PostJournalResponse>> {
    try {
      await this.postingService.postJournalEntry(request.journalEntryId, request.ledgerId);
      return ProcessResult.success({
        batchId: 'B-' + request.journalEntryId,
        status: 'POSTED'
      });
    } catch (error: any) {
      return ProcessResult.failure(error.message);
    }
  }
}

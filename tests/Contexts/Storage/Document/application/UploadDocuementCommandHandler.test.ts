import {anything, deepEqual, instance, mock, verify, when} from 'ts-mockito';
import {Storage} from '../../../../../src/Contexts/Storage/Document/domain/services/Storage';
import {
  UploadDocumentCommandHandler
} from '../../../../../src/Contexts/Storage/Document/application/Upload/UploadDocumentCommandHandler';
import {
  UploadDocumentCommand
} from '../../../../../src/Contexts/Storage/Document/application/Upload/UploadDocumentCommand';
import {HeadersBuilder} from '../../../../../src/Contexts/Storage/Document/domain/services/HeadersBuilder';


import {EventBus} from "../../../../../src/Contexts/Shared/domain/EventBus";



let storage: Storage;
let sut: UploadDocumentCommandHandler;
let eventBus: EventBus;
beforeEach(() => {
  storage = mock<Storage>();
  eventBus = mock<EventBus>();
  sut = new UploadDocumentCommandHandler(instance(storage), instance(eventBus));
});

describe('RetrieveDocument', () => {
  it('Should upload a document', async () => {
    const headers = {'x-bucket': 'bucket'};
    const metadata = {...HeadersBuilder.customXHeaders({headers: headers})};
    when(storage.upload(deepEqual({id: '123', body: 'body', metadata: metadata}), 'bucket')).thenResolve();
    await sut.handle(new UploadDocumentCommand('123', 'body', headers));

    verify(storage.upload(deepEqual({id: '123', body: 'body', metadata: metadata}), 'bucket')).called();
    verify(eventBus.publish(anything())).called();
  });
});

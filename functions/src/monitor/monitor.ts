// 3rd party
import { FirebaseAdmin } from '../client/firebase-admin';

// DashboardHub
import { Ping, PingResponse } from '../client/ping';
import { Logger } from './../client/logger';
import { MonitorModel, PingModel, ProjectModel } from './../models/index.model';

type Document = FirebaseFirestore.DocumentSnapshot

export interface MonitorInfoInput {
  token: string;
  projectUid: string;
  monitorUid: string;
}

export const getMonitorPings: any = async (token: string, projectUid: string, monitorUid: string) => {
  const document: Document = await FirebaseAdmin.firestore()
    .collection('projects')
    .doc(projectUid)
    .get();
  const project: ProjectModel = <ProjectModel> document.data();
  Logger.info(project);
  const monitor: MonitorModel = project.monitors.find((item: MonitorModel) => item.uid === monitorUid);
  Logger.info(monitor);
  const uri: string = project.url + monitor.path;

  const start: number = (new Date()).getMilliseconds();
  const response: PingResponse = await Ping<PingResponse>(uri, token);
  Logger.info(response);
  const end: number = (new Date()).getMilliseconds();
  const pingResult: PingModel = {
    statusCode: response.statusCode,
    expectedCode: monitor.expectedCode,
    expectedText: monitor.expectedText,
    duration: end - start, // Milli seconds
    codeMatched: monitor.expectedCode === response.statusCode,
    textMatched: monitor.expectedText ? response.body.includes(monitor.expectedText) : true,
  };
  pingResult.isValid = !!(pingResult.codeMatched && pingResult.textMatched);

  Logger.info(pingResult);

  await FirebaseAdmin
    .firestore()
    .collection(`projects/${projectUid}/pings`)
    .add(pingResult);

  return pingResult;
}

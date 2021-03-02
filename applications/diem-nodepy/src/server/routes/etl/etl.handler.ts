import { promises as fs } from 'fs';
import path from 'path';
import { utils } from '@common/utils';
import { IError } from '@interfaces';
import { IntJob, IHandler, ECodeLanguage } from '../../config/interfaces';
import { etlNodepy } from './etl.nodepy';

const base64decode: (file: string) => string = (file: string) => {
    const buff: Buffer = Buffer.from(file, 'base64');

    return buff.toString('utf8');
};

export const etlHandler: (req: any, res: any) => any = async (req: any, res: any) => {
    if (req.method === 'GET') {
        return res.status(200).json({
            message: 'Only Post is allowed',
        });
    }

    const job: IntJob = { ...req.body };

    try {
        const resp: any = await handler(job);

        return res.status(200).json(resp);
    } catch (err) {
        return res.status(500).json(err);
    }
};

export const handler: (job: IntJob) => any = async (job: IntJob): Promise<IHandler> => {
    if (!job.id) {
        return Promise.reject({
            ok: false,
            message: 'The is no ID in this job',
        });
    }

    const id: string = job.id;

    utils.logInfo(`$etl.handler (handler): new request - job: ${id}`, job.transid);

    // clean up the file and fill in the missing data
    const code: string = base64decode(job.code);

    await fs.mkdir(`${path.resolve()}/workdir/${id}/workdir`, { recursive: true }).catch(async (err: IError) => {
        err.caller = 'rest.handler (handler): mkdir';
        err.message = `Executor: Could not create the folder for job ${id}`;

        void utils.logError(`$etl.handler (handler): mkdir - job: ${id}`, err);

        return Promise.reject(err);
    });

    const extention: string = job.language === ECodeLanguage.javascript ? 'js' : 'py';

    await fs.writeFile(`${path.resolve()}/workdir/${id}/${id}.${extention}`, code).catch(async (error: Error) => {
        const err: IError = {
            ...error,
            caller: 'rest.handler (handler): writeFile',
            message: `Executor: Could not save the file for job ${id}`,
        };

        void utils.logError(`$etl.handler (handler): savefile - job: ${id}`, err);

        return Promise.reject(err);
    });

    // just start it , no need to await here
    void etlNodepy(job);

    return Promise.resolve({ ok: true, id });

    // execute the file
};

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const webhook_1 = require("@slack/webhook");
function Send(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        core.debug(JSON.stringify(github.context, null, 2));
        const webhook = newWebhook();
        yield webhook.send(payload);
        core.debug('send message');
    });
}
exports.Send = Send;
function successPayload(text) {
    const payload = {
        text: 'Succeeded Workflow',
        attachments: [
            {
                color: 'good',
                author_name: 'action-slack',
                fields: [
                    { title: 'repo', value: github.context.repo.repo, short: true },
                    { title: 'sha', value: github.context.sha, short: true },
                    { title: 'actor', value: github.context.actor, short: true },
                    { title: 'eventName', value: github.context.eventName, short: true },
                    { title: 'ref', value: github.context.ref, short: true },
                    { title: 'workflow', value: github.context.workflow, short: true },
                ],
            },
        ],
    };
    if (text !== '') {
        payload.text = text;
    }
    return payload;
}
exports.successPayload = successPayload;
function failurePayload(text, mention) {
    const payload = successPayload(text);
    payload.text = '';
    if (mention !== '') {
        payload.text = `<!${mention}> `;
    }
    if (text !== '') {
        payload.text += `Failed Workflow`;
    }
    else {
        payload.text = text;
    }
    if (payload.attachments !== undefined) {
        payload.attachments[0].color = 'danger';
    }
    return payload;
}
exports.failurePayload = failurePayload;
function newWebhook() {
    if (process.env.SLACK_WEBHOOK_URL === undefined) {
        throw new Error('Specify SLACK_WEBHOOK_URL');
    }
    const url = process.env.SLACK_WEBHOOK_URL;
    return new webhook_1.IncomingWebhook(url);
}
import { MessageItem, ToolCallInfo } from '../types';

export class ConversationManager {
  private messages: MessageItem[] = [];
  private onUpdate?: (messages: MessageItem[]) => void;

  constructor(onUpdate?: (messages: MessageItem[]) => void) {
    this.onUpdate = onUpdate;
  }

  public addMessage(sender: 'user' | 'myraa' | 'system', text: string, toolCalls?: ToolCallInfo[]): MessageItem {
    const msg: MessageItem = {
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      sender,
      text,
      timestamp: Date.now(),
      toolCalls,
    };
    this.messages.push(msg);
    this.onUpdate?.([...this.messages]);
    return msg;
  }

  public updateLastAssistantMessage(text: string) {
    for (let i = this.messages.length - 1; i >= 0; i--) {
      if (this.messages[i].sender === 'myraa') {
        this.messages[i].text = text;
        this.onUpdate?.([...this.messages]);
        return;
      }
    }
    this.addMessage('myraa', text);
  }

  public appendToLastAssistantMessage(chunk: string) {
    for (let i = this.messages.length - 1; i >= 0; i--) {
      if (this.messages[i].sender === 'myraa') {
        this.messages[i].text += chunk;
        this.onUpdate?.([...this.messages]);
        return;
      }
    }
    this.addMessage('myraa', chunk);
  }

  public getMessages(): MessageItem[] {
    return [...this.messages];
  }

  public clear() {
    this.messages = [];
    this.onUpdate?.([]);
  }
}

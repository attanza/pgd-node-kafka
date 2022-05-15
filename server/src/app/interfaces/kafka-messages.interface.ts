export interface IKafkaMessage {
  value: string;
}

export interface IKafkaMessages {
  messages: IKafkaMessage[];
}

type ConnectionCache = {
  connection: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
};

export declare global {
  var mongoose: ConnectionCache;
}

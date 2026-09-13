import server from './_server.cjs';
const app = server.default || server.app || server;

export default function handler(req, res) {
  return app(req, res);
}

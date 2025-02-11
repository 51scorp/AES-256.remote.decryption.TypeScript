import { Client } from 'ssh2';
import * as crypto from 'crypto';

/**
 * SSH connection configuration.
 *
 * @property ip Server IP address.
 * @property username Username for connection (optional).
 * @property password Password for connection (optional).
 */
export interface SshConnectionConfig {
  ip: string;
  username?: string;
  password?: string;
  privateKeyPath?: string;
}

/**
 * Decryption configuration.
 *
 * @property filePath Path to the file that needs to be decrypted (optional).
 * @property decryptionKey Key for decryption (optional).
 */
export interface DecryptionConfig {
  filePath?: string;
  decryptionKey?: string;
}

/**
 * Downloads a file via SFTP over SSH and decrypts it.
 *
 * @example
 *   // Example usage with password
 *   const sshConfig = {
 *     ip: '192.168.0.1',
 *     username: 'user',
 *     password: 'securepassword',
 *   };
 *
 *   const decryptionConfig = {
 *     filePath: '/path/to/encrypted/file',
 *     decryptionKey: 'my-decryption-key',
 *   };
 *
 *   const result = await fetchAndDecryptFile(sshConfig, decryptionConfig);
 *   console.log(result); // Decrypted file content
 *
 * @example
 *   // Example usage with private key
 *   const sshConfig = {
 *     ip: '192.168.0.1',
 *     username: 'user',
 *     privateKeyPath: '/path/to/private/key',
 *   };
 *
 *   const decryptionConfig = {
 *     filePath: '/path/to/encrypted/file',
 *   };
 *
 *   const result = await fetchAndDecryptFile(sshConfig, decryptionConfig);
 *   console.log(result); // Decrypted file content
 *
 * @param sshConfig SSH connection configuration:
 *
 *   - `ip` — Server IP address.
 *   - `username` — Username for connection (optional).
 *   - `password` — Password for connection (optional).
 *   - `privateKeyPath` — Path to the private key for authentication (optional).
 *   - `tryKeyboard` — Use interactive keyboard authentication (optional).
 *
 * @param decryptionConfig Decryption configuration:
 *
 *   - `filePath` — Path to the file that needs to be decrypted (optional, defaults to `defaultPathEncryptedFile`).
 *   - `decryptionKey` — Key for decryption (optional, defaults to `process.env.KEY_ETCD`).
 *
 * @returns Decrypted file content as a string, or `null` if an error occurred.
 */

export async function fetchAndDecryptFile(
  sshConfig: SshConnectionConfig,
  decryptionConfig: DecryptionConfig
): Promise<string | null> {
  const decryptionInfo: any = {
    filePath: decryptionConfig.filePath ?? defaultPathEncryptedFile,
    decryptionKey: decryptionConfig.decryptionKey ?? `${process.env.KEY_ETCD}`,
  };

  const fetchFileViaSSH = (): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
      const client = new Client();

      const connectionConfig: any = {
        host: sshConfig.ip,
        port: 22,
        username: sshConfig.username ?? `${process.env.YOUR__ENV_USERNAME}`,
        tryKeyboard: true,
        password: sshConfig.password ?? `${process.env.YOUR__ENV_PASSWORD}`,
        privateKey: sshConfig.privateKeyPath ? fs.readFileSync(sshConfig.privateKeyPath, 'utf8') : undefined,
      };

      if (sshConfig.privateKeyPath) {
        try {
          connectionConfig.privateKey = fs.readFileSync(sshConfig.privateKeyPath, 'utf8');
        } catch (err) {
          return reject(`Error reading private key: ${err.message}`);
        }
      }
      client
        .on('ready', () => {
          client.sftp((err, sftp) => {
            if (err) {
              client.end();
              return reject(`Error opening SFTP session: ${err.message}`);
            }
            sftp.readFile(decryptionInfo.filePath, (readErr, data) => {
              client.end();
              if (readErr) {
                return reject(`Error reading file: ${readErr.message}`);
              }
              resolve(data);
            });
          });
        })
        .on('error', err => {
          reject(`SSH connection error: ${err.message}`);
        })
        .on('keyboard-interactive', (name, instructions, lang, prompts, finish) => {
          if (connectionConfig.password) {
            finish([connectionConfig.password]);
          } else {
            reject('Interactive authentication is not possible without a password');
          }
        })
        .connect(connectionConfig);
    });
  };

  const decryptData = (encryptedData: Buffer, key: Buffer): string => {
    const iv = encryptedData.slice(0, 16);
    const ciphertext = encryptedData.slice(16);
    const cipher = crypto.createDecipheriv('aes-256-cfb', key, iv);
    let decrypted = cipher.update(ciphertext);
    decrypted = Buffer.concat([decrypted, cipher.final()]);

    return decrypted.toString('utf-8');
  };

  try {
    const encryptedContent = await fetchFileViaSSH();
    const key = Buffer.from(decryptionInfo.decryptionKey, 'utf-8');
    return decryptData(encryptedContent, key);
  } catch (error) {
    console.error(`Error: ${error}`);
    return null;
  }
}

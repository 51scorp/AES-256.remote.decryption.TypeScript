# Fetch and Decrypt File via SSH

## Description
This module allows downloading files via SFTP over SSH and decrypting them using AES-256-CFB. It supports authentication via password, private key, and interactive authentication.

## Installation
Before using, install the dependencies:

```sh
npm install ssh2 crypto fs
```

## Usage

### Import the module
```typescript
import { fetchAndDecryptFile } from './your-module';
```

### Example Usage

#### Authentication with a Password
```typescript
const sshConfig = {
  ip: '192.168.0.1',
  username: 'user',
  password: 'securepassword',
};

const decryptionConfig = {
  filePath: '/path/to/encrypted/file',
  decryptionKey: 'my-decryption-key',
};

const result = await fetchAndDecryptFile(sshConfig, decryptionConfig);
console.log(result); // Decrypted file content
```

#### Authentication with a Private Key
```typescript
const sshConfig = {
  ip: '192.168.0.1',
  username: 'user',
  privateKeyPath: '/path/to/private/key',
};

const decryptionConfig = {
  filePath: '/path/to/encrypted/file',
};

const result = await fetchAndDecryptFile(sshConfig, decryptionConfig);
console.log(result); // Decrypted file content
```

#### Interactive Authentication
```typescript
const sshConfig = {
  ip: '192.168.0.1',
  tryKeyboard: true,
  username: 'user',
  password: 'securepassword',
};

const decryptionConfig = {
  decryptionKey: 'another-decryption-key',
};

const result = await fetchAndDecryptFile(sshConfig, decryptionConfig);
console.log(result); // Decrypted file content
```

## Configuration Parameters

### `SshConnectionConfig`
| Field            | Type     | Description |
|----------------|--------|----------|
| `ip`          | string | Server IP address |
| `username`    | string | Username (optional) |
| `password`    | string | Authentication password (optional) |
| `privateKeyPath` | string | Path to the private key (optional) |
| `tryKeyboard` | boolean | Use interactive authentication (optional) |

### `DecryptionConfig`
| Field            | Type     | Description |
|----------------|--------|----------|
| `filePath`     | string | Path to the file to decrypt (optional) |
| `decryptionKey` | string | Decryption key (optional) |

## Possible Errors
- Error reading the private key
- Error opening the SFTP session
- Error reading the file
- SSH connection error
- Interactive authentication is not possible without a password

## Environment Variables
This module uses environment variables for connection configuration:
- `YOUR__ENV_USERNAME` — default username.
- `YOUR__ENV_PASSWORD` — default password.

## License
MIT



//______________________________________________________________________________________________________________


RUS

# Fetch and Decrypt File via SSH

## Описание
Этот модуль позволяет загружать файлы через SFTP по SSH и расшифровывать их с использованием AES-256-CFB. Он поддерживает аутентификацию по паролю, приватному ключу и интерактивную аутентификацию.

## Установка
Перед использованием необходимо установить зависимости:

```sh
npm install ssh2 crypto fs
```

## Использование

### Импорт модуля
```typescript
import { fetchAndDecryptFile } from './your-module';
```

### Пример использования

#### Аутентификация по паролю
```typescript
const sshConfig = {
  ip: '192.168.0.1',
  username: 'user',
  password: 'securepassword',
};

const decryptionConfig = {
  filePath: '/path/to/encrypted/file',
  decryptionKey: 'my-decryption-key',
};

const result = await fetchAndDecryptFile(sshConfig, decryptionConfig);
console.log(result); // Расшифрованное содержимое файла
```

#### Аутентификация по приватному ключу
```typescript
const sshConfig = {
  ip: '192.168.0.1',
  username: 'user',
  privateKeyPath: '/path/to/private/key',
};

const decryptionConfig = {
  filePath: '/path/to/encrypted/file',
};

const result = await fetchAndDecryptFile(sshConfig, decryptionConfig);
console.log(result); // Расшифрованное содержимое файла
```

#### Интерактивная аутентификация
```typescript
const sshConfig = {
  ip: '192.168.0.1',
  tryKeyboard: true,
  username: 'user',
  password: 'securepassword',
};

const decryptionConfig = {
  decryptionKey: 'another-decryption-key',
};

const result = await fetchAndDecryptFile(sshConfig, decryptionConfig);
console.log(result); // Расшифрованное содержимое файла
```

## Описание параметров

### `SshConnectionConfig`
| Поле            | Тип     | Описание |
|----------------|--------|----------|
| `ip`          | string | IP-адрес сервера |
| `username`    | string | Имя пользователя (опционально) |
| `password`    | string | Пароль для аутентификации (опционально) |
| `privateKeyPath` | string | Путь к приватному ключу (опционально) |
| `tryKeyboard` | boolean | Использовать интерактивную аутентификацию (опционально) |

### `DecryptionConfig`
| Поле            | Тип     | Описание |
|----------------|--------|----------|
| `filePath`     | string | Путь к файлу для расшифровки (опционально) |
| `decryptionKey` | string | Ключ для расшифровки (опционально) |

## Возможные ошибки
- Ошибка при чтении приватного ключа
- Ошибка при открытии SFTP-сессии
- Ошибка при чтении файла
- Ошибка подключения SSH
- Интерактивная аутентификация невозможна без пароля

## Переменные окружения
Этот модуль использует переменные окружения для конфигурации подключения:
- `YOUR__ENV_USERNAME` — имя пользователя по умолчанию.
- `YOUR__ENV_PASSWORD` — пароль по умолчанию.

## Лицензия
MIT


# Git hooks with Husky, Lint-Staged và CommitLint

## 1. Công nghệ sử dụng:

- **[Prettier](https://github.com/prettier/prettier):** là code formatter
- **[ESLint](https://github.com/eslint/eslint):** là một tool để phân tích code Javascript để xác định các đoạn code có lỗi (hoặc có khả năng có lỗi), và có thể fix tự động.
- **[Lint-Staged](https://github.com/okonet/lint-staged):** cho phép ta thực hiện một hoặc một số công việc chỉ với những file được git staged
- **[CommitLint](https://github.com/conventional-changelog/commitlint):** dùng CommitLint ta sẽ đảm bảo được tất cả các commit đều phải có nội dung theo chuẩn
- **[Husky](https://github.com/typicode/husky):** là một tool mà nó có thể bắt được event khi ta thao tác với Git repository (add, commit,...) và từ đó ta có thể thực hiện các hành động tương ứng, hoặc ngăn không cho commit.

## 2. Tại sao nên sử dụng?

### 2.1. Vấn đề format code

- Có nhiều dev tham gia code trong dự án và style code khác nhau:

Ví dụ: 

→ Kiểu 1: dùng dấu nháy kép, xuống dòng tab (cách 4 khoảng trắng), không dùng dấu chấm phẩy “;” ở cuối dòng code 

```jsx
if(condition) {
    console.log("if")
}else {
    console.log("else")
}
```

→ Kiểu 2: dùng dấu nháy đơn, xuống dòng tab (cách 2 khoảng trắng), có dùng dấu chấm phẩy “;” ở cuối dòng code 

```jsx
if (condition) {
  console.log('if');
} else {
  console.log('else');
}
```

- Source bị chạy, không format, khó đọc:

```jsx
if          (condition) {
        console.log("if");
}               else if (other_condition) {
        console.log("else if");
    } else {
                console.log("else");
}
```

<aside>
💡 **⇒** dùng Prettier để format code trước khi commit sẽ đưa code về 1 dạng chuẩn duy nhất được người viết quy định, giúp đồng bộ code của các dev trong 1 project

</aside>

### 2.2. Vấn đề nội dung code

- Thường trong source sẽ có những đoạn code dư thừa

Ví dụ:

```jsx
function example() {
  const b = 1;
  console.log("hello example");
}

example();
```

![Untitled](Git%20hooks%20with%20Husky,%20Lint-Staged%20va%CC%80%20CommitLint%20f0bedb8c425944ceae4f04d0cdacbbe1/Untitled.png)

→ Ví trụ trên cho thấy biến b được khai báo mà không được sử dụng (dư thừa), khi này ESLint sẽ cảnh báo (nếu có cài và sử dụng nó trên VSCode) 

<aside>
💡 ⚠️ Vấn đề nếu không sử dụng VSCode thì làm sao biết được điều này
**⇒** Giải pháp: ESLint có thể được chạy bằng command, viết sẵn command để thực hiện bước này để check source trước khi commit code

</aside>

## 3. Thực hiện

- Trong package.json định nghĩa sẵn 2 scripts: format và lint để chạy prettier và eslint (check cho các file javascript có trong source).

```json
"scripts": {
    "postinstall": "husky install",
    "start": "node index.js",
    "format": "prettier --write \"./**/*.js\" --ignore-path .gitignore",
    "lint": "eslint \"./**/*.js\" --ignore-path .gitignore --fix"
  },
```

### 3.1. Set up

🚀 Đầu tiên ta cần cài `lint-staged`, chạy command:

```bash
yarn add --dev lint-staged
```

Sau khi cài xong, mở file `package.json`, ở `scripts` thêm vào cuối file `package.json` cấu hình của `lint-staged`:

```bash
"lint-staged": {
	"*.ts": [
		"npm run lint",
		"npm run format",
	]
}
```

lint-staged sẽ chạy 2 script: lint và format để chạy Prettier và ESLint (đã định nghĩa ở trên)

🚀 Tiếp theo cài đặt và cấu hình `Husky` bằng command:

```bash
yarn add --dev husky
```

Sau khi chạy xong project sẽ có 1 folder mới tên là `.husky`

![Untitled](Git%20hooks%20with%20Husky,%20Lint-Staged%20va%CC%80%20CommitLint%20f0bedb8c425944ceae4f04d0cdacbbe1/Untitled%201.png)

Tiếp theo ta để set Husky bắt lấy event tại thời điểm user gõ `git commit` chạy command sau:

```bash
npx husky add .husky/pre-commit "yarn lint-staged”
```

Ở trên ta bắt event `pre-commit` thì chạy command `yarn lint-staged`. Ngay sau đó Husky sinh ra 1 file tên là `pre-commit` trong folder `.husky` với nội dung như sau:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

yarn lint-staged
```

🧪 Test thử với commit change

File ban đầu:

```jsx
app.get('/name', (req, res) => {
  let name = req.query.name;
  if (typeof name !== 'undefined' && name) {
    res.send(`Hello ${name}!`);
  } else {
    res.send('Hello!');
  }
});
```

Chỉnh sửa đoạn code thành:

```jsx
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const b = 1;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

```

- Tiến hành add file
    
    ![Untitled](Git%20hooks%20with%20Husky,%20Lint-Staged%20va%CC%80%20CommitLint%20f0bedb8c425944ceae4f04d0cdacbbe1/Untitled%202.png)
    

<aside>
💡 Husky bắt đầu chạy và check ra biến b khai báo mà không dùng (dư thừa code) và không cho phép commit

</aside>

![Untitled](Git%20hooks%20with%20Husky,%20Lint-Staged%20va%CC%80%20CommitLint%20f0bedb8c425944ceae4f04d0cdacbbe1/Untitled%203.png)

- Xóa biến b trong source đi và sửa code cho source bị chạy lộn xộn

```
			const express = require('express');
						const app = express();
			const port = 3000;

		app.get('/', (req, res) => {
			  res.send('Hello World!');
});

        app.get('/name', (req, res) => {
            let name = req.query.name;
          if (typeof name !== 'undefined' && name) {
          res.send(`Hello ${name}!`);
  } else {
              res.send('Hello!');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
```

- Tiến hành commit lại code

![Untitled](Git%20hooks%20with%20Husky,%20Lint-Staged%20va%CC%80%20CommitLint%20f0bedb8c425944ceae4f04d0cdacbbe1/Untitled%204.png)

<aside>
💡 ⇒ Khi này code đã chạy thành công và đã commit được và code sau trước khi commit đã được format lại thành:

</aside>

```jsx
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/name', (req, res) => {
  let name = req.query.name;
  if (typeof name !== 'undefined' && name) {
    res.send(`Hello ${name}!`);
  } else {
    res.send('Hello!');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
```

### 3.2. Định nghĩa dạng chuẩn cho commit message

- Sẽ có những commit không rõ nội dung dạng như:

```bash
git commit -m "update something”
```

⇒ Khi này người khác vào xem log sẽ không biết something ở đây là gì

- Và team có 10 người sẽ có 10 commit

```bash
git commit -m "update something 1"

git commit -m "update something 2"
...
git commit -m "update something 10"
```

Giải pháp:

<aside>
💡 Bằng việc dùng CommitLint ta sẽ đảm bảo được tất cả các commit đều phải có nội dung theo chuẩn

</aside>

🚀 **Thực hiện:** 

Đầu tiên ta cài CommitLint: 

```bash
yarn add commitlint/{config-conventional,cli} —dev
```

Ở trên ta vừa cài CommitLint ta cài luôn cả `config-conventional` đây là cấu hình commit dựa theo [chuẩn commit của Angular](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-guidelines)

Tiếp theo setup Husky để nó bắt được event và lấy ra commit message, chạy command:

```bash
npx husky add .husky/commit-msg "”
```

Sau đó mở file `.husky/commit-msg` và sửa lại nội dung như sau:

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx --no-install commitlint --edit "$1"
```

Ở trên ta lấy ra commit message của cái commit gần nhất (tính tới thời điểm ta vừa gõ xong `git commit` nếu có)

Tiếp đó ở root project ta tạo file `.commitlintrc.js` với nội dung như sau:

```jsx
module.exports = {extends: ['@commitlint/config-conventional']};
```

🧪 **Test thử bằng cách commit:**

![Untitled](Git%20hooks%20with%20Husky,%20Lint-Staged%20va%CC%80%20CommitLint%20f0bedb8c425944ceae4f04d0cdacbbe1/Untitled%205.png)

- Ở trên ta thấy CommitLint báo 2 lỗi đó là `subject` và `type` không được để trống.

📝 Thử test lại bằng cách commit theo chuẩn của Angular

Theo chuẩn Angular (chuẩn mà ta sử dụng ở bài này), 1 commit message sẽ theo cấu trúc như sau:

`type(scope?): subject`

`type` ở trên có thể là:

- build: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- ci: Changes to our CI configuration files and scripts (example scopes: Gitlab CI, Circle, BrowserStack, SauceLabs)
- chore: add something without touching production code (Eg: update npm dependencies)
- docs: Documentation only changes
- feat: A new feature
- fix: A bug fix
- perf: A code change that improves performance
- refactor: A code change that neither fixes a bug nor adds a feature
- revert: Reverts a previous commit
- style: Changes that do not affect the meaning of the code (Eg: adding white-space, formatting, missing semi-colons, etc)
- test: Adding missing tests or correcting existing tests

🧪 **Test thử bằng cách commit theo tiêu chuẩn của Angular:**

![Untitled](Git%20hooks%20with%20Husky,%20Lint-Staged%20va%CC%80%20CommitLint%20f0bedb8c425944ceae4f04d0cdacbbe1/Untitled%206.png)

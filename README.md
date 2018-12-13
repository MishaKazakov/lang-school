# Перед запуском проекта

1. Установить [meteor](https://www.meteor.com/install).
2. Добавить ssh ключ в [gitlab](https://gitlab.com/profile/keys).
3. Скачайте [vs code](https://code.visualstudio.com/) и установите обязательно дополение `Prettier`.

# Запуск

1. Клонируем `git clone git@gitlab.com:lang-school/project.git`
1. Переходим в папку `cd project`.
1. Устанавливаем пакеты `meteor npm i`.
1. Запускаем проект `meteor`.
1. Создаем свою ветку в гите `git checkout -b 'имя-ветки'`. имя-ветки для фронта префикс `ui-имя-ветки` для бэка `api-имя-ветки`
1. Работаем.
   > обязательно форматируем `ctrl+shift+i`

# Merge

Когда работа по задаче закночилась ее необходимо подготовить к слиянию.

1. Добавляем все измененные файлы `git add --all`.
2. Создаем комит `git commit -m "сообщение комита(что было сделано)"`.
3. Если было больше одного комита в ветке, то нужно соединить все в один.
4. `git log --oneline` считаем (сверху вниз) сколько комитов до комита с подписью `origin/master`, например **N**. И выполняем `git rebase -i HEAD~N`.

> Появиться что-то типа такого

```
pick f7f3f6d changed my name a bit
pick 310154e updated README formatting and added blame
pick a5f4a0d added cat-file

# Rebase 710f0f8..a5f4a0d onto 710f0f8
#
# Commands:
#  p, pick = use commit
#  e, edit = use commit, but stop for amending
#  s, squash = use commit, but meld into previous commit
#
# If you remove a line here THAT COMMIT WILL BE LOST.
# However, if you remove everything, the rebase will be aborted.
```

Нужно заменить у всех комитов кроме перевого pick на s.

5. Сохраняем, выходим.
6. Получаем последние изменеия `git fetch --all -p`. Затем делаем `git rebase origin/master`.
7. Если есть кофликты, то разруливаем. Если нет, то `git push --force origin имя-ветки`.
8. Говорите Мише, что пора сливать ветку.
9. Если все ок, она поподает в `master`, иначе испрвляем.
10. Переключаемся на мастер `git checkout master` и скачиваем его `git pull origin master`.
11. И вновь создаем новую ветку `git checkout -b 'имя-ветки'`.
12. Работаем.

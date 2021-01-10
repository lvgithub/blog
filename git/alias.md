#! https://zhuanlan.zhihu.com/p/343179718

# 通过 git alias 提高效率 
## 配置别名

vim ~/.gitconfig
```
[alias]
        st = status
        co = checkout
        ci = commit
        cim = commit -m
        df = diff
        br = branch
        pr = pull --rebase origin master
        pl = pull
        ps = push
        ct = commit
        lg = log --stat
        lgp = log --stat -p
        lgg = log --graph
        lgga = log --graph --decorate --all
        lgm = log --graph --max-count=10
        lo = log --oneline --decorate       
        lol = log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit
        lola = log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit --all    
        log = log --oneline --decorate --graph
        loga = log --oneline --decorate --graph --all
```
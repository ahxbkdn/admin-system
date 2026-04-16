package com.example.auth.security;

import org.springframework.security.core.GrantedAuthority;

import java.util.ArrayList;
import java.util.List;

public class CustomGrantedAuthority implements java.util.Collection<GrantedAuthority> {
    private List<GrantedAuthority> authorities;

    public CustomGrantedAuthority(List<String> roles, List<String> permissions) {
        authorities = new ArrayList<>();

        // 添加角色
        for (String role : roles) {
            authorities.add(() -> "ROLE_" + role);
        }

        // 添加权限
        for (String permission : permissions) {
            authorities.add(() -> permission);
        }
    }

    @Override
    public int size() {
        return authorities.size();
    }

    @Override
    public boolean isEmpty() {
        return authorities.isEmpty();
    }

    @Override
    public boolean contains(Object o) {
        return authorities.contains(o);
    }

    @Override
    public java.util.Iterator<GrantedAuthority> iterator() {
        return authorities.iterator();
    }

    @Override
    public Object[] toArray() {
        return authorities.toArray();
    }

    @Override
    public <T> T[] toArray(T[] a) {
        return authorities.toArray(a);
    }

    @Override
    public boolean add(GrantedAuthority grantedAuthority) {
        return authorities.add(grantedAuthority);
    }

    @Override
    public boolean remove(Object o) {
        return authorities.remove(o);
    }

    @Override
    public boolean containsAll(java.util.Collection<?> c) {
        return authorities.containsAll(c);
    }

    @Override
    public boolean addAll(java.util.Collection<? extends GrantedAuthority> c) {
        return authorities.addAll(c);
    }

    @Override
    public boolean removeAll(java.util.Collection<?> c) {
        return authorities.removeAll(c);
    }

    @Override
    public boolean retainAll(java.util.Collection<?> c) {
        return authorities.retainAll(c);
    }

    @Override
    public void clear() {
        authorities.clear();
    }
}
package com.dev.api.service.login.impl;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.transaction.Transactional;

import org.springframework.stereotype.Repository;

import com.dev.api.service.login.DaoRemote;

@Repository
public class DaoBean<T> implements DaoRemote<T> {

	@PersistenceContext
	private EntityManager em;

	@Transactional
	@Override
	public <T> T save(T t) {
		T t2 = null;
		try {
			t2 = em.merge(t);
		} catch (Throwable e) {
			e.printStackTrace();
		}
		return t2;
	}

	@Transactional
	@Override
	public <T> List<T> getObjectList(String jpql, Object... objects) {
		List<T> list = null;
		try {
			Query query = em.createQuery(jpql);

			for (int i = 0; i < objects.length; i++) {
				query.setParameter(i + 1, objects[i]);
			}
			list = query.getResultList();
		} catch (Throwable e) {
			e.printStackTrace();
		}

		return list;
	}

}

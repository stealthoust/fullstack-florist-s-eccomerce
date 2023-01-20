package com.florist.springbackend.config;


import com.florist.springbackend.Entity.Category;
import com.florist.springbackend.Entity.Country;
import com.florist.springbackend.Entity.Product;
import com.florist.springbackend.Entity.State;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    private EntityManager entityManager;

    @Value("${allowed.origins}")
    private String[] theAllowedOrigins;


    public MyDataRestConfig(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        HttpMethod[] unsupportedActions={HttpMethod.POST,HttpMethod.PUT,HttpMethod.PATCH,HttpMethod.DELETE};

        disableHttpMethods(Product.class,config,unsupportedActions);
        disableHttpMethods(Category.class,config,unsupportedActions);
        disableHttpMethods(Country.class,config,unsupportedActions);
        disableHttpMethods(State.class,config,unsupportedActions);

        exposeIds(config);

        cors.addMapping(config.getBasePath()+"/**").allowedOrigins(theAllowedOrigins);
    }

    // disable methods for current class
    private static void disableHttpMethods(Class theclass, RepositoryRestConfiguration configuration, HttpMethod[] unsupportedActions){
        configuration.getExposureConfiguration()
                .forDomainType(theclass)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(unsupportedActions))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(unsupportedActions));
    }

    private void exposeIds(RepositoryRestConfiguration configuration)
    {
       /* Can be also
        config.exposeIdsFor(entityManager.getMetamodel().getEntities().stream().map(e -> e.getJavaType()).collect(Collectors.toList()).toArray(new Class[0]));
        configuration.exposeIdsFor(domainType);
        */

        Set<EntityType<?>> entities=entityManager.getMetamodel().getEntities();
        List<Class> entityClasses=new ArrayList<>();

        for(EntityType entityType:entities)
        {
            entityClasses.add(entityType.getJavaType());
            Class[] domainType=entityClasses.toArray(new Class[0]);
            configuration.exposeIdsFor(domainType);
        }
    }
}

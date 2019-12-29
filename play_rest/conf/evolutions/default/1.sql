# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table ingrediente (
  id                            bigserial not null,
  nombre                        varchar(255),
  constraint pk_ingrediente primary key (id)
);

create table receta (
  id                            bigserial not null,
  nombre                        varchar(255),
  preparacion                   TEXT,
  publicante_id                 bigint,
  extra_id                      bigint,
  constraint uq_receta_extra_id unique (extra_id),
  constraint pk_receta primary key (id)
);

create table receta_ingrediente (
  receta_id                     bigint not null,
  ingrediente_id                bigint not null,
  constraint pk_receta_ingrediente primary key (receta_id,ingrediente_id)
);

create table receta_extra (
  id                            bigserial not null,
  calorias                      integer,
  fecha_publicacion             timestamptz,
  constraint pk_receta_extra primary key (id)
);

create table receta_review (
  autor_id                      bigint,
  receta_id                     bigint,
  texto                         TEXT,
  nota                          float not null
);

create table usuario (
  id                            bigserial not null,
  username                      varchar(255),
  password                      varchar(255),
  constraint pk_usuario primary key (id)
);

create index ix_receta_publicante_id on receta (publicante_id);
alter table receta add constraint fk_receta_publicante_id foreign key (publicante_id) references usuario (id) on delete restrict on update restrict;

alter table receta add constraint fk_receta_extra_id foreign key (extra_id) references receta_extra (id) on delete restrict on update restrict;

create index ix_receta_ingrediente_receta on receta_ingrediente (receta_id);
alter table receta_ingrediente add constraint fk_receta_ingrediente_receta foreign key (receta_id) references receta (id) on delete restrict on update restrict;

create index ix_receta_ingrediente_ingrediente on receta_ingrediente (ingrediente_id);
alter table receta_ingrediente add constraint fk_receta_ingrediente_ingrediente foreign key (ingrediente_id) references ingrediente (id) on delete restrict on update restrict;

create index ix_receta_review_autor_id on receta_review (autor_id);
alter table receta_review add constraint fk_receta_review_autor_id foreign key (autor_id) references usuario (id) on delete restrict on update restrict;

create index ix_receta_review_receta_id on receta_review (receta_id);
alter table receta_review add constraint fk_receta_review_receta_id foreign key (receta_id) references receta (id) on delete restrict on update restrict;


# --- !Downs

alter table if exists receta drop constraint if exists fk_receta_publicante_id;
drop index if exists ix_receta_publicante_id;

alter table if exists receta drop constraint if exists fk_receta_extra_id;

alter table if exists receta_ingrediente drop constraint if exists fk_receta_ingrediente_receta;
drop index if exists ix_receta_ingrediente_receta;

alter table if exists receta_ingrediente drop constraint if exists fk_receta_ingrediente_ingrediente;
drop index if exists ix_receta_ingrediente_ingrediente;

alter table if exists receta_review drop constraint if exists fk_receta_review_autor_id;
drop index if exists ix_receta_review_autor_id;

alter table if exists receta_review drop constraint if exists fk_receta_review_receta_id;
drop index if exists ix_receta_review_receta_id;

drop table if exists ingrediente cascade;

drop table if exists receta cascade;

drop table if exists receta_ingrediente cascade;

drop table if exists receta_extra cascade;

drop table if exists receta_review cascade;

drop table if exists usuario cascade;


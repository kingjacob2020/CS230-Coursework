PRAGMA foreign_keys = ON;

create table if not exists artists(
    id integer primary key autoincrement,
    name text not null,
    genre text not null,
    monthly_listeners integer not null
);

create table if not exists albums(
    id integer primary key autoincrement,
    name text not null,
    release_year integer not null,
    listens integer not null,
    artist_id integer not null,
    foreign key (artist_id) references artists(id) on delete cascade
);

create table if not exists songs(
    id integer primary key autoincrement,
    name text not null,
    release_year integer not null,
    album_id integer not null,
    foreign key (album_id) references albums(id) on delete cascade
);

insert or ignore into artists values
(1, 'the weeknd', 'r&b', 100000000),
(2, 'drake', 'hip-hop', 120000000);

insert or ignore into albums values
(1, 'house of balloons', 2011, 50000000, 1),
(2, 'thursday', 2011, 60000000, 2),
(3, 'echoes of silence', 2011, 40000000, 2),
(4, 'take care', 2011, 80000000, 2),
(5, 'scorpion', 2020, 90000000, 1);

insert or ignore into songs values
(1, 'high for this', 2011, 1),
(2, 'the morning', 2011, 1),
(3, 'house of balloons / glass tables', 2011, 1),
(4, 'heaven or las vegas', 2011, 1),
(5, 'the knowing', 2011, 1),
(6, 'life of the party', 2011, 2),
(7, 'thursday', 2011, 2),
(8, 'the zone', 2011, 2),
(9, 'the birds part 1', 2011, 2),
(10, 'the birds part 2', 2011, 2);
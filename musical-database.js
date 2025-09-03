// Comprehensive Theatre Database
// Based on Wikipedia's lists - musicals, plays, operas, and all stage shows

class MusicalDatabase {
    static getMusicals() {
        return [
            // Classic Broadway Musicals (1940s-1960s)
            { id: 'musical_oklahoma', title: 'Oklahoma!', synopsis: 'Musical about settlers in Oklahoma Territory', composer: 'Richard Rodgers', lyricist: 'Oscar Hammerstein II', genre: 'Musical', premiere_date: '1943-03-31', source: 'musical-db' },
            { id: 'musical_carousel', title: 'Carousel', synopsis: 'Musical about a carousel barker and mill worker', composer: 'Richard Rodgers', lyricist: 'Oscar Hammerstein II', genre: 'Musical', premiere_date: '1945-04-19', source: 'musical-db' },
            { id: 'musical_annie_get_gun', title: 'Annie Get Your Gun', synopsis: 'Musical about sharpshooter Annie Oakley', composer: 'Irving Berlin', lyricist: 'Irving Berlin', genre: 'Musical', premiere_date: '1946-05-16', source: 'musical-db' },
            { id: 'musical_south_pacific', title: 'South Pacific', synopsis: 'Musical set during World War II in the Pacific', composer: 'Richard Rodgers', lyricist: 'Oscar Hammerstein II', genre: 'Musical', premiere_date: '1949-04-07', source: 'musical-db' },
            { id: 'musical_guys_dolls', title: 'Guys and Dolls', synopsis: 'Musical about gamblers and missionaries in NYC', composer: 'Frank Loesser', lyricist: 'Frank Loesser', genre: 'Musical', premiere_date: '1950-11-24', source: 'musical-db' },
            { id: 'musical_king_i', title: 'The King and I', synopsis: 'Musical about British teacher in Siam', composer: 'Richard Rodgers', lyricist: 'Oscar Hammerstein II', genre: 'Musical', premiere_date: '1951-03-29', source: 'musical-db' },
            { id: 'musical_singin_rain', title: 'Singin\' in the Rain', synopsis: 'Musical adaptation of the classic film', composer: 'Nacio Herb Brown', lyricist: 'Arthur Freed', genre: 'Musical', premiere_date: '1952-03-27', source: 'musical-db' },
            { id: 'musical_west_side', title: 'West Side Story', synopsis: 'Romeo and Juliet set in 1950s New York', composer: 'Leonard Bernstein', lyricist: 'Stephen Sondheim', genre: 'Musical', premiere_date: '1957-09-26', source: 'musical-db' },
            { id: 'musical_music_man', title: 'The Music Man', synopsis: 'Musical about a con man selling band instruments', composer: 'Meredith Willson', lyricist: 'Meredith Willson', genre: 'Musical', premiere_date: '1957-12-19', source: 'musical-db' },
            { id: 'musical_sound_music', title: 'The Sound of Music', synopsis: 'Musical about the von Trapp family in Austria', composer: 'Richard Rodgers', lyricist: 'Oscar Hammerstein II', genre: 'Musical', premiere_date: '1959-11-16', source: 'musical-db' },
            { id: 'musical_bye_bye_birdie', title: 'Bye Bye Birdie', synopsis: 'Musical about rock and roll star being drafted', composer: 'Charles Strouse', lyricist: 'Lee Adams', genre: 'Musical', premiere_date: '1960-04-14', source: 'musical-db' },
            { id: 'musical_camelot', title: 'Camelot', synopsis: 'Musical about King Arthur and the Knights of the Round Table', composer: 'Frederick Loewe', lyricist: 'Alan Jay Lerner', genre: 'Musical', premiere_date: '1960-12-03', source: 'musical-db' },
            { id: 'musical_hello_dolly', title: 'Hello, Dolly!', synopsis: 'Musical about matchmaker Dolly Levi', composer: 'Jerry Herman', lyricist: 'Jerry Herman', genre: 'Musical', premiere_date: '1964-01-16', source: 'musical-db' },
            { id: 'musical_fiddler_roof', title: 'Fiddler on the Roof', synopsis: 'Musical about Jewish life in Imperial Russia', composer: 'Jerry Bock', lyricist: 'Sheldon Harnick', genre: 'Musical', premiere_date: '1964-09-22', source: 'musical-db' },
            { id: 'musical_man_la_mancha', title: 'Man of La Mancha', synopsis: 'Musical about Don Quixote and Miguel de Cervantes', composer: 'Mitch Leigh', lyricist: 'Joe Darion', genre: 'Musical', premiere_date: '1965-11-22', source: 'musical-db' },
            { id: 'musical_cabaret', title: 'Cabaret', synopsis: 'Musical set in 1930s Berlin during the rise of Nazism', composer: 'John Kander', lyricist: 'Fred Ebb', genre: 'Musical', premiere_date: '1966-11-20', source: 'musical-db' },

            // 1970s Musicals
            { id: 'musical_hair', title: 'Hair', synopsis: 'Rock musical about the hippie counterculture', composer: 'Galt MacDermot', lyricist: 'Gerome Ragni, James Rado', genre: 'Musical', premiere_date: '1967-10-17', source: 'musical-db' },
            { id: 'musical_jesus_christ', title: 'Jesus Christ Superstar', synopsis: 'Rock opera about the last week of Jesus Christ', composer: 'Andrew Lloyd Webber', lyricist: 'Tim Rice', genre: 'Musical', premiere_date: '1971-10-12', source: 'musical-db' },
            { id: 'musical_godspell', title: 'Godspell', synopsis: 'Musical based on the Gospel of Matthew', composer: 'Stephen Schwartz', lyricist: 'Stephen Schwartz', genre: 'Musical', premiere_date: '1971-05-17', source: 'musical-db' },
            { id: 'musical_grease', title: 'Grease', synopsis: 'Musical about high school romance in the 1950s', composer: 'Jim Jacobs, Warren Casey', lyricist: 'Jim Jacobs, Warren Casey', genre: 'Musical', premiere_date: '1972-02-14', source: 'musical-db' },
            { id: 'musical_pippin', title: 'Pippin', synopsis: 'Musical about Charlemagne\'s son searching for meaning', composer: 'Stephen Schwartz', lyricist: 'Stephen Schwartz', genre: 'Musical', premiere_date: '1972-10-23', source: 'musical-db' },
            { id: 'musical_little_night', title: 'A Little Night Music', synopsis: 'Musical based on Ingmar Bergman\'s film', composer: 'Stephen Sondheim', lyricist: 'Stephen Sondheim', genre: 'Musical', premiere_date: '1973-02-25', source: 'musical-db' },
            { id: 'musical_chicago', title: 'Chicago', synopsis: 'Musical about murder, greed, corruption, and fame', composer: 'John Kander', lyricist: 'Fred Ebb', genre: 'Musical', premiere_date: '1975-06-03', source: 'musical-db' },
            { id: 'musical_chorus_line', title: 'A Chorus Line', synopsis: 'Musical about Broadway dancers auditioning', composer: 'Marvin Hamlisch', lyricist: 'Edward Kleban', genre: 'Musical', premiere_date: '1975-07-25', source: 'musical-db' },
            { id: 'musical_annie', title: 'Annie', synopsis: 'Musical about an orphan girl and billionaire Daddy Warbucks', composer: 'Charles Strouse', lyricist: 'Martin Charnin', genre: 'Musical', premiere_date: '1977-04-21', source: 'musical-db' },

            // 1980s Musicals
            { id: 'musical_evita', title: 'Evita', synopsis: 'Musical about Eva Perón, First Lady of Argentina', composer: 'Andrew Lloyd Webber', lyricist: 'Tim Rice', genre: 'Musical', premiere_date: '1978-06-21', source: 'musical-db' },
            { id: 'musical_sweeney_todd', title: 'Sweeney Todd: The Demon Barber of Fleet Street', synopsis: 'Musical thriller about a vengeful barber', composer: 'Stephen Sondheim', lyricist: 'Stephen Sondheim', genre: 'Musical', premiere_date: '1979-03-01', source: 'musical-db' },
            { id: 'musical_cats', title: 'Cats', synopsis: 'Musical based on T.S. Eliot\'s Old Possum\'s Book of Practical Cats', composer: 'Andrew Lloyd Webber', lyricist: 'T.S. Eliot', genre: 'Musical', premiere_date: '1981-05-11', source: 'musical-db' },
            { id: 'musical_dreamgirls', title: 'Dreamgirls', synopsis: 'Musical about a 1960s girl group similar to The Supremes', composer: 'Henry Krieger', lyricist: 'Tom Eyen', genre: 'Musical', premiere_date: '1981-12-20', source: 'musical-db' },
            { id: 'musical_nine', title: 'Nine', synopsis: 'Musical based on Federico Fellini\'s film 8½', composer: 'Maury Yeston', lyricist: 'Maury Yeston', genre: 'Musical', premiere_date: '1982-05-09', source: 'musical-db' },
            { id: 'musical_la_cage', title: 'La Cage aux Folles', synopsis: 'Musical about a gay couple and their drag club', composer: 'Jerry Herman', lyricist: 'Jerry Herman', genre: 'Musical', premiere_date: '1983-08-21', source: 'musical-db' },
            { id: 'musical_sunday_park', title: 'Sunday in the Park with George', synopsis: 'Musical inspired by Georges Seurat\'s painting', composer: 'Stephen Sondheim', lyricist: 'Stephen Sondheim', genre: 'Musical', premiere_date: '1984-05-02', source: 'musical-db' },
            { id: 'musical_big_river', title: 'Big River', synopsis: 'Musical adaptation of Mark Twain\'s Huckleberry Finn', composer: 'Roger Miller', lyricist: 'Roger Miller', genre: 'Musical', premiere_date: '1985-04-25', source: 'musical-db' },
            { id: 'musical_les_mis', title: 'Les Misérables', synopsis: 'Musical based on Victor Hugo\'s novel', composer: 'Claude-Michel Schönberg', lyricist: 'Alain Boublil, Herbert Kretzmer', genre: 'Musical', premiere_date: '1985-10-08', source: 'musical-db' },
            { id: 'musical_phantom', title: 'The Phantom of the Opera', synopsis: 'Musical about a mysterious figure who haunts the Paris Opera House', composer: 'Andrew Lloyd Webber', lyricist: 'Charles Hart, Richard Stilgoe', genre: 'Musical', premiere_date: '1986-10-09', source: 'musical-db' },
            { id: 'musical_into_woods', title: 'Into the Woods', synopsis: 'Musical that intertwines various fairy tales', composer: 'Stephen Sondheim', lyricist: 'Stephen Sondheim', genre: 'Musical', premiere_date: '1987-11-05', source: 'musical-db' },

            // 1990s Musicals
            { id: 'musical_city_angels', title: 'City of Angels', synopsis: 'Musical noir about a detective writer and his fictional character', composer: 'Cy Coleman', lyricist: 'David Zippel', genre: 'Musical', premiere_date: '1989-12-11', source: 'musical-db' },
            { id: 'musical_grand_hotel', title: 'Grand Hotel', synopsis: 'Musical set in 1928 Berlin\'s Grand Hotel', composer: 'Robert Wright, George Forrest', lyricist: 'Robert Wright, George Forrest', genre: 'Musical', premiere_date: '1989-11-12', source: 'musical-db' },
            { id: 'musical_assassins', title: 'Assassins', synopsis: 'Musical about people who attempted to assassinate U.S. Presidents', composer: 'Stephen Sondheim', lyricist: 'Stephen Sondheim', genre: 'Musical', premiere_date: '1990-12-18', source: 'musical-db' },
            { id: 'musical_miss_saigon', title: 'Miss Saigon', synopsis: 'Musical set during the Vietnam War', composer: 'Claude-Michel Schönberg', lyricist: 'Alain Boublil, Richard Maltby Jr.', genre: 'Musical', premiere_date: '1991-04-11', source: 'musical-db' },
            { id: 'musical_secret_garden', title: 'The Secret Garden', synopsis: 'Musical based on Frances Hodgson Burnett\'s novel', composer: 'Lucy Simon', lyricist: 'Marsha Norman', genre: 'Musical', premiere_date: '1991-04-25', source: 'musical-db' },
            { id: 'musical_crazy_for_you', title: 'Crazy for You', synopsis: 'Musical featuring Gershwin songs', composer: 'George Gershwin', lyricist: 'Ira Gershwin', genre: 'Musical', premiere_date: '1992-02-19', source: 'musical-db' },
            { id: 'musical_kiss_of_spider', title: 'Kiss of the Spider Woman', synopsis: 'Musical about prisoners in an Argentine jail', composer: 'John Kander', lyricist: 'Fred Ebb', genre: 'Musical', premiere_date: '1993-05-03', source: 'musical-db' },
            { id: 'musical_passion', title: 'Passion', synopsis: 'Musical about obsessive love in 19th century Italy', composer: 'Stephen Sondheim', lyricist: 'Stephen Sondheim', genre: 'Musical', premiere_date: '1994-05-09', source: 'musical-db' },
            { id: 'musical_sunset_blvd', title: 'Sunset Boulevard', synopsis: 'Musical based on the classic film noir', composer: 'Andrew Lloyd Webber', lyricist: 'Don Black, Christopher Hampton', genre: 'Musical', premiere_date: '1994-11-17', source: 'musical-db' },
            { id: 'musical_show_boat', title: 'Show Boat', synopsis: 'Musical about life on a Mississippi River showboat', composer: 'Jerome Kern', lyricist: 'Oscar Hammerstein II', genre: 'Musical', premiere_date: '1927-12-27', source: 'musical-db' },
            { id: 'musical_rent', title: 'Rent', synopsis: 'Rock musical about bohemian artists in NYC dealing with AIDS', composer: 'Jonathan Larson', lyricist: 'Jonathan Larson', genre: 'Musical', premiere_date: '1996-04-29', source: 'musical-db' },
            { id: 'musical_chicago_revival', title: 'Chicago (1996 Revival)', synopsis: 'Revival of the 1975 musical about murder and fame', composer: 'John Kander', lyricist: 'Fred Ebb', genre: 'Musical', premiere_date: '1996-06-03', source: 'musical-db' },
            { id: 'musical_titanic', title: 'Titanic', synopsis: 'Musical about the sinking of the RMS Titanic', composer: 'Maury Yeston', lyricist: 'Maury Yeston', genre: 'Musical', premiere_date: '1997-04-23', source: 'musical-db' },
            { id: 'musical_lion_king', title: 'The Lion King', synopsis: 'Disney musical adaptation featuring African music and puppetry', composer: 'Elton John, Hans Zimmer', lyricist: 'Tim Rice', genre: 'Musical', premiere_date: '1997-11-13', source: 'musical-db' },
            { id: 'musical_ragtime', title: 'Ragtime', synopsis: 'Musical based on E.L. Doctorow\'s novel about early 20th century America', composer: 'Stephen Flaherty', lyricist: 'Lynn Ahrens', genre: 'Musical', premiere_date: '1998-01-18', source: 'musical-db' },

            // 2000s Musicals
            { id: 'musical_producers', title: 'The Producers', synopsis: 'Musical comedy about producing a Broadway flop', composer: 'Mel Brooks', lyricist: 'Mel Brooks', genre: 'Musical', premiere_date: '2001-04-19', source: 'musical-db' },
            { id: 'musical_urinetown', title: 'Urinetown', synopsis: 'Satirical musical comedy about corporate control and social inequality', composer: 'Mark Hollmann', lyricist: 'Mark Hollmann, Greg Kotis', genre: 'Musical', premiere_date: '2001-09-20', source: 'musical-db' },
            { id: 'musical_mamma_mia', title: 'Mamma Mia!', synopsis: 'Musical featuring songs by ABBA set on a Greek island', composer: 'Benny Andersson, Björn Ulvaeus', lyricist: 'Björn Ulvaeus', genre: 'Musical', premiere_date: '2001-10-18', source: 'musical-db' },
            { id: 'musical_thoroughly_modern', title: 'Thoroughly Modern Millie', synopsis: 'Musical set in 1920s New York about a small-town girl', composer: 'Jeanine Tesori', lyricist: 'Dick Scanlan', genre: 'Musical', premiere_date: '2002-04-18', source: 'musical-db' },
            { id: 'musical_hairspray', title: 'Hairspray', synopsis: 'Musical about racial integration in 1960s Baltimore', composer: 'Marc Shaiman', lyricist: 'Scott Wittman, Marc Shaiman', genre: 'Musical', premiere_date: '2002-08-15', source: 'musical-db' },
            { id: 'musical_avenue_q', title: 'Avenue Q', synopsis: 'Musical comedy featuring puppets addressing adult themes', composer: 'Robert Lopez, Jeff Marx', lyricist: 'Robert Lopez, Jeff Marx', genre: 'Musical', premiere_date: '2003-07-31', source: 'musical-db' },
            { id: 'musical_wicked', title: 'Wicked', synopsis: 'Musical about the witches of Oz before Dorothy arrives', composer: 'Stephen Schwartz', lyricist: 'Stephen Schwartz', genre: 'Musical', premiere_date: '2003-10-30', source: 'musical-db' },
            { id: 'musical_caroline', title: 'Caroline, or Change', synopsis: 'Musical about a Black maid in 1960s Louisiana', composer: 'Jeanine Tesori', lyricist: 'Tony Kushner', genre: 'Musical', premiere_date: '2004-05-02', source: 'musical-db' },
            { id: 'musical_monty_python', title: 'Monty Python\'s Spamalot', synopsis: 'Musical comedy based on Monty Python and the Holy Grail', composer: 'John Du Prez, Eric Idle', lyricist: 'Eric Idle', genre: 'Musical', premiere_date: '2005-03-17', source: 'musical-db' },
            { id: 'musical_light_plaza', title: 'The Light in the Piazza', synopsis: 'Musical about an American mother and daughter in 1950s Italy', composer: 'Adam Guettel', lyricist: 'Adam Guettel', genre: 'Musical', premiere_date: '2005-04-18', source: 'musical-db' },
            { id: 'musical_jersey_boys', title: 'Jersey Boys', synopsis: 'Jukebox musical about Frankie Valli and The Four Seasons', composer: 'Bob Gaudio', lyricist: 'Bob Crewe', genre: 'Musical', premiere_date: '2005-11-06', source: 'musical-db' },
            { id: 'musical_spelling_bee', title: 'The 25th Annual Putnam County Spelling Bee', synopsis: 'Musical comedy about a spelling bee competition', composer: 'William Finn', lyricist: 'Rachel Sheinkin', genre: 'Musical', premiere_date: '2005-05-02', source: 'musical-db' },
            { id: 'musical_spring_awakening', title: 'Spring Awakening', synopsis: 'Rock musical about teenage sexuality and repression', composer: 'Duncan Sheik', lyricist: 'Steven Sater', genre: 'Musical', premiere_date: '2006-12-10', source: 'musical-db' },
            { id: 'musical_in_heights', title: 'In the Heights', synopsis: 'Musical about Latino residents of Washington Heights, NYC', composer: 'Lin-Manuel Miranda', lyricist: 'Lin-Manuel Miranda', genre: 'Musical', premiere_date: '2008-03-09', source: 'musical-db' },
            { id: 'musical_next_normal', title: 'Next to Normal', synopsis: 'Rock musical about mental illness and family', composer: 'Tom Kitt', lyricist: 'Brian Yorkey', genre: 'Musical', premiere_date: '2009-04-15', source: 'musical-db' },

            // 2010s Musicals
            { id: 'musical_book_mormon', title: 'The Book of Mormon', synopsis: 'Satirical musical by South Park creators about Mormon missionaries', composer: 'Trey Parker, Robert Lopez, Matt Stone', lyricist: 'Trey Parker, Robert Lopez, Matt Stone', genre: 'Musical', premiere_date: '2011-03-24', source: 'musical-db' },
            { id: 'musical_newsies', title: 'Newsies', synopsis: 'Musical based on Disney film about newspaper boys strike', composer: 'Alan Menken', lyricist: 'Jack Feldman', genre: 'Musical', premiere_date: '2012-03-29', source: 'musical-db' },
            { id: 'musical_once', title: 'Once', synopsis: 'Musical based on the indie film about musicians in Dublin', composer: 'Glen Hansard, Marketa Irglova', lyricist: 'Glen Hansard, Marketa Irglova', genre: 'Musical', premiere_date: '2012-03-18', source: 'musical-db' },
            { id: 'musical_matilda', title: 'Matilda The Musical', synopsis: 'Musical based on Roald Dahl\'s novel about a gifted girl', composer: 'Tim Minchin', lyricist: 'Tim Minchin', genre: 'Musical', premiere_date: '2013-04-11', source: 'musical-db' },
            { id: 'musical_kinky_boots', title: 'Kinky Boots', synopsis: 'Musical about drag queens and a shoe factory', composer: 'Cyndi Lauper', lyricist: 'Cyndi Lauper', genre: 'Musical', premiere_date: '2013-04-04', source: 'musical-db' },
            { id: 'musical_hedwig', title: 'Hedwig and the Angry Inch', synopsis: 'Rock musical about a transgender rock singer', composer: 'Stephen Trask', lyricist: 'Stephen Trask', genre: 'Musical', premiere_date: '2014-04-22', source: 'musical-db' },
            { id: 'musical_fun_home', title: 'Fun Home', synopsis: 'Musical memoir about family, sexuality, and coming of age', composer: 'Jeanine Tesori', lyricist: 'Lisa Kron', genre: 'Musical', premiere_date: '2015-04-19', source: 'musical-db' },
            { id: 'musical_something_rotten', title: 'Something Rotten!', synopsis: 'Comedy musical about Shakespeare and musicals', composer: 'Wayne Kirkpatrick', lyricist: 'Karey Kirkpatrick', genre: 'Musical', premiere_date: '2015-04-22', source: 'musical-db' },
            { id: 'musical_hamilton', title: 'Hamilton', synopsis: 'Hip-hop musical biography of Alexander Hamilton', composer: 'Lin-Manuel Miranda', lyricist: 'Lin-Manuel Miranda', genre: 'Musical', premiere_date: '2015-08-06', source: 'musical-db' },
            { id: 'musical_dear_evan', title: 'Dear Evan Hansen', synopsis: 'Musical about social anxiety, suicide, and social media', composer: 'Benj Pasek, Justin Paul', lyricist: 'Benj Pasek, Justin Paul', genre: 'Musical', premiere_date: '2016-12-04', source: 'musical-db' },
            { id: 'musical_come_away', title: 'Come From Away', synopsis: 'Musical about 9/11 and Newfoundland hospitality', composer: 'Irene Sankoff, David Hein', lyricist: 'Irene Sankoff, David Hein', genre: 'Musical', premiere_date: '2017-03-12', source: 'musical-db' },
            { id: 'musical_band_visit', title: 'The Band\'s Visit', synopsis: 'Musical about Egyptian musicians stranded in Israeli town', composer: 'David Yazbek', lyricist: 'David Yazbek', genre: 'Musical', premiere_date: '2017-11-09', source: 'musical-db' },
            { id: 'musical_frozen', title: 'Frozen', synopsis: 'Disney musical adaptation of the animated film', composer: 'Kristen Anderson-Lopez, Robert Lopez', lyricist: 'Kristen Anderson-Lopez, Robert Lopez', genre: 'Musical', premiere_date: '2018-03-22', source: 'musical-db' },
            { id: 'musical_mean_girls', title: 'Mean Girls', synopsis: 'Musical based on the Tina Fey film', composer: 'Jeff Richmond', lyricist: 'Nell Benjamin', genre: 'Musical', premiere_date: '2018-04-08', source: 'musical-db' },
            { id: 'musical_hadestown', title: 'Hadestown', synopsis: 'Folk opera retelling the myths of Orpheus and Eurydice', composer: 'Anaïs Mitchell', lyricist: 'Anaïs Mitchell', genre: 'Musical', premiere_date: '2019-04-17', source: 'musical-db' },
            { id: 'musical_beetlejuice', title: 'Beetlejuice', synopsis: 'Musical based on Tim Burton\'s supernatural comedy film', composer: 'Eddie Perfect', lyricist: 'Eddie Perfect', genre: 'Musical', premiere_date: '2019-04-25', source: 'musical-db' },

            // 2020s Musicals
            { id: 'musical_six', title: 'SIX The Musical', synopsis: 'Pop concert-style musical about the six wives of Henry VIII', composer: 'Toby Marlow, Lucy Moss', lyricist: 'Toby Marlow, Lucy Moss', genre: 'Musical', premiere_date: '2020-03-12', source: 'musical-db' },
            { id: 'musical_jagged_pill', title: 'Jagged Little Pill', synopsis: 'Musical featuring Alanis Morissette songs', composer: 'Alanis Morissette, Glen Ballard', lyricist: 'Alanis Morissette', genre: 'Musical', premiere_date: '2019-12-05', source: 'musical-db' },
            { id: 'musical_moulin_rouge', title: 'Moulin Rouge! The Musical', synopsis: 'Jukebox musical based on Baz Luhrmann\'s film', composer: 'Various', lyricist: 'Various', genre: 'Musical', premiere_date: '2019-07-25', source: 'musical-db' },
            { id: 'musical_little_shop', title: 'Little Shop of Horrors', synopsis: 'Musical comedy about a man-eating plant', composer: 'Alan Menken', lyricist: 'Howard Ashman', genre: 'Musical', premiere_date: '1982-07-27', source: 'musical-db' },

            // Classic Stage Plays
            { id: 'play_hamlet', title: 'Hamlet', synopsis: 'Shakespeare\'s tragedy about the Prince of Denmark', composer: 'N/A', lyricist: 'William Shakespeare', genre: 'Play', premiere_date: '1602-01-01', source: 'musical-db' },
            { id: 'play_macbeth', title: 'Macbeth', synopsis: 'Shakespeare\'s tragedy about Scottish ambition and murder', composer: 'N/A', lyricist: 'William Shakespeare', genre: 'Play', premiere_date: '1606-01-01', source: 'musical-db' },
            { id: 'play_romeo_juliet', title: 'Romeo and Juliet', synopsis: 'Shakespeare\'s tragic love story', composer: 'N/A', lyricist: 'William Shakespeare', genre: 'Play', premiere_date: '1597-01-01', source: 'musical-db' },
            { id: 'play_king_lear', title: 'King Lear', synopsis: 'Shakespeare\'s tragedy about an aging king and his daughters', composer: 'N/A', lyricist: 'William Shakespeare', genre: 'Play', premiere_date: '1606-01-01', source: 'musical-db' },
            { id: 'play_othello', title: 'Othello', synopsis: 'Shakespeare\'s tragedy of jealousy and manipulation', composer: 'N/A', lyricist: 'William Shakespeare', genre: 'Play', premiere_date: '1603-01-01', source: 'musical-db' },
            { id: 'play_midsummer', title: 'A Midsummer Night\'s Dream', synopsis: 'Shakespeare\'s comedy about love and magic', composer: 'N/A', lyricist: 'William Shakespeare', genre: 'Play', premiere_date: '1596-01-01', source: 'musical-db' },
            { id: 'play_much_ado', title: 'Much Ado About Nothing', synopsis: 'Shakespeare\'s witty comedy about love and deception', composer: 'N/A', lyricist: 'William Shakespeare', genre: 'Play', premiere_date: '1599-01-01', source: 'musical-db' },
            { id: 'play_twelfth_night', title: 'Twelfth Night', synopsis: 'Shakespeare\'s comedy of mistaken identity', composer: 'N/A', lyricist: 'William Shakespeare', genre: 'Play', premiere_date: '1602-01-01', source: 'musical-db' },

            // Modern Classic Plays
            { id: 'play_death_salesman', title: 'Death of a Salesman', synopsis: 'Arthur Miller\'s tragedy about the American Dream', composer: 'N/A', lyricist: 'Arthur Miller', genre: 'Play', premiere_date: '1949-02-10', source: 'musical-db' },
            { id: 'play_crucible', title: 'The Crucible', synopsis: 'Arthur Miller\'s drama about the Salem witch trials', composer: 'N/A', lyricist: 'Arthur Miller', genre: 'Play', premiere_date: '1953-01-22', source: 'musical-db' },
            { id: 'play_view_bridge', title: 'A View from the Bridge', synopsis: 'Arthur Miller\'s tragedy about family and obsession', composer: 'N/A', lyricist: 'Arthur Miller', genre: 'Play', premiere_date: '1955-09-29', source: 'musical-db' },
            { id: 'play_streetcar', title: 'A Streetcar Named Desire', synopsis: 'Tennessee Williams\' drama about Blanche DuBois', composer: 'N/A', lyricist: 'Tennessee Williams', genre: 'Play', premiere_date: '1947-12-03', source: 'musical-db' },
            { id: 'play_glass_menagerie', title: 'The Glass Menagerie', synopsis: 'Tennessee Williams\' memory play about family', composer: 'N/A', lyricist: 'Tennessee Williams', genre: 'Play', premiere_date: '1944-12-26', source: 'musical-db' },
            { id: 'play_cat_hot_tin', title: 'Cat on a Hot Tin Roof', synopsis: 'Tennessee Williams\' drama about family secrets', composer: 'N/A', lyricist: 'Tennessee Williams', genre: 'Play', premiere_date: '1955-03-24', source: 'musical-db' },
            { id: 'play_long_day', title: 'Long Day\'s Journey Into Night', synopsis: 'Eugene O\'Neill\'s autobiographical family drama', composer: 'N/A', lyricist: 'Eugene O\'Neill', genre: 'Play', premiere_date: '1956-11-07', source: 'musical-db' },
            { id: 'play_iceman_cometh', title: 'The Iceman Cometh', synopsis: 'Eugene O\'Neill\'s drama about pipe dreams and reality', composer: 'N/A', lyricist: 'Eugene O\'Neill', genre: 'Play', premiere_date: '1946-10-09', source: 'musical-db' },

            // British Plays
            { id: 'play_waiting_godot', title: 'Waiting for Godot', synopsis: 'Samuel Beckett\'s absurdist play about waiting', composer: 'N/A', lyricist: 'Samuel Beckett', genre: 'Play', premiere_date: '1953-01-05', source: 'musical-db' },
            { id: 'play_importance_earnest', title: 'The Importance of Being Earnest', synopsis: 'Oscar Wilde\'s witty comedy of manners', composer: 'N/A', lyricist: 'Oscar Wilde', genre: 'Play', premiere_date: '1895-02-14', source: 'musical-db' },
            { id: 'play_look_back_anger', title: 'Look Back in Anger', synopsis: 'John Osborne\'s kitchen sink drama', composer: 'N/A', lyricist: 'John Osborne', genre: 'Play', premiere_date: '1956-05-08', source: 'musical-db' },
            { id: 'play_birthday_party', title: 'The Birthday Party', synopsis: 'Harold Pinter\'s menacing comedy', composer: 'N/A', lyricist: 'Harold Pinter', genre: 'Play', premiere_date: '1958-04-28', source: 'musical-db' },
            { id: 'play_homecoming', title: 'The Homecoming', synopsis: 'Harold Pinter\'s family drama', composer: 'N/A', lyricist: 'Harold Pinter', genre: 'Play', premiere_date: '1965-06-03', source: 'musical-db' },

            // Contemporary Plays
            { id: 'play_angels_america', title: 'Angels in America', synopsis: 'Tony Kushner\'s epic about AIDS and politics', composer: 'N/A', lyricist: 'Tony Kushner', genre: 'Play', premiere_date: '1991-05-04', source: 'musical-db' },
            { id: 'play_rabbit_hole', title: 'Rabbit Hole', synopsis: 'David Lindsay-Abaire\'s drama about grief', composer: 'N/A', lyricist: 'David Lindsay-Abaire', genre: 'Play', premiere_date: '2006-02-02', source: 'musical-db' },
            { id: 'play_god_carnage', title: 'God of Carnage', synopsis: 'Yasmina Reza\'s comedy about parenting', composer: 'N/A', lyricist: 'Yasmina Reza', genre: 'Play', premiere_date: '2006-12-11', source: 'musical-db' },
            { id: 'play_curious_incident', title: 'The Curious Incident of the Dog in the Night-Time', synopsis: 'Play adaptation of Mark Haddon\'s novel', composer: 'N/A', lyricist: 'Simon Stephens', genre: 'Play', premiere_date: '2012-08-02', source: 'musical-db' },

            // Classic Operas
            { id: 'opera_la_boheme', title: 'La Bohème', synopsis: 'Puccini\'s opera about young artists in Paris', composer: 'Giacomo Puccini', lyricist: 'Giuseppe Giacosa, Luigi Illica', genre: 'Opera', premiere_date: '1896-02-01', source: 'musical-db' },
            { id: 'opera_tosca', title: 'Tosca', synopsis: 'Puccini\'s dramatic opera set in Rome', composer: 'Giacomo Puccini', lyricist: 'Giuseppe Giacosa, Luigi Illica', genre: 'Opera', premiere_date: '1900-01-14', source: 'musical-db' },
            { id: 'opera_madama_butterfly', title: 'Madama Butterfly', synopsis: 'Puccini\'s tragic opera about East meets West', composer: 'Giacomo Puccini', lyricist: 'Giuseppe Giacosa, Luigi Illica', genre: 'Opera', premiere_date: '1904-02-17', source: 'musical-db' },
            { id: 'opera_carmen', title: 'Carmen', synopsis: 'Bizet\'s opera about a fiery Spanish woman', composer: 'Georges Bizet', lyricist: 'Henri Meilhac, Ludovic Halévy', genre: 'Opera', premiere_date: '1875-03-03', source: 'musical-db' },
            { id: 'opera_don_giovanni', title: 'Don Giovanni', synopsis: 'Mozart\'s opera about the legendary seducer', composer: 'Wolfgang Amadeus Mozart', lyricist: 'Lorenzo Da Ponte', genre: 'Opera', premiere_date: '1787-10-29', source: 'musical-db' },
            { id: 'opera_marriage_figaro', title: 'The Marriage of Figaro', synopsis: 'Mozart\'s comic opera about love and class', composer: 'Wolfgang Amadeus Mozart', lyricist: 'Lorenzo Da Ponte', genre: 'Opera', premiere_date: '1786-05-01', source: 'musical-db' },
            { id: 'opera_magic_flute', title: 'The Magic Flute', synopsis: 'Mozart\'s fantastical opera with masonic themes', composer: 'Wolfgang Amadeus Mozart', lyricist: 'Emanuel Schikaneder', genre: 'Opera', premiere_date: '1791-09-30', source: 'musical-db' },
            { id: 'opera_rigoletto', title: 'Rigoletto', synopsis: 'Verdi\'s tragic opera about a hunchbacked court jester', composer: 'Giuseppe Verdi', lyricist: 'Francesco Maria Piave', genre: 'Opera', premiere_date: '1851-03-11', source: 'musical-db' },
            { id: 'opera_aida', title: 'Aida', synopsis: 'Verdi\'s grand opera set in ancient Egypt', composer: 'Giuseppe Verdi', lyricist: 'Antonio Ghislanzoni', genre: 'Opera', premiere_date: '1871-12-24', source: 'musical-db' },
            { id: 'opera_traviata', title: 'La Traviata', synopsis: 'Verdi\'s opera about love and sacrifice', composer: 'Giuseppe Verdi', lyricist: 'Francesco Maria Piave', genre: 'Opera', premiere_date: '1853-03-06', source: 'musical-db' },

            // Modern Dance/Performance
            { id: 'dance_nutcracker', title: 'The Nutcracker', synopsis: 'Tchaikovsky\'s beloved Christmas ballet', composer: 'Pyotr Ilyich Tchaikovsky', lyricist: 'N/A', genre: 'Ballet', premiere_date: '1892-12-18', source: 'musical-db' },
            { id: 'dance_swan_lake', title: 'Swan Lake', synopsis: 'Tchaikovsky\'s tragic ballet about a cursed princess', composer: 'Pyotr Ilyich Tchaikovsky', lyricist: 'N/A', genre: 'Ballet', premiere_date: '1877-03-04', source: 'musical-db' },
            { id: 'dance_sleeping_beauty', title: 'The Sleeping Beauty', synopsis: 'Tchaikovsky\'s fairy tale ballet', composer: 'Pyotr Ilyich Tchaikovsky', lyricist: 'N/A', genre: 'Ballet', premiere_date: '1890-01-15', source: 'musical-db' },
            { id: 'dance_giselle', title: 'Giselle', synopsis: 'Romantic ballet about love beyond death', composer: 'Adolphe Adam', lyricist: 'N/A', genre: 'Ballet', premiere_date: '1841-06-28', source: 'musical-db' }
        ];
    }

    static searchMusicals(query) {
        const musicals = this.getMusicals();
        const lowerQuery = query.toLowerCase();
        
        return musicals.filter(musical =>
            musical.title.toLowerCase().includes(lowerQuery) ||
            musical.composer.toLowerCase().includes(lowerQuery) ||
            musical.lyricist.toLowerCase().includes(lowerQuery) ||
            musical.synopsis.toLowerCase().includes(lowerQuery)
        );
    }
}

// Make it available globally
window.MusicalDatabase = MusicalDatabase;

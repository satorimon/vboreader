// Performance boxリーダ
//VSDメーターのrefference
//https://yoshinrt.github.io/vsd/log_reader.html
LogReaderInfo.push({
	Caption:	"Performance box (*.vbo*)",
	Filter:		"*.vbo",
	ReaderFunc:	"Read_vbo"
});

function Read_vbo( Files ){
	
	Log.Time		= [];
	Log.Longitude	= [];
	Log.Latitude	= [];
	Log.Speed		= [];
	Log.Altitude	= [];
	Log.Direction   = [];
	
	var	Cnt = 0;
	var Line;
	
	for( var i = 0; i < Files.length; ++i ){
		var file = new File();
		try{
			file.Open( Files[ i ], "zr" );
		}catch( e ){
			MessageBox( "ファイルが開けません: " + Files[ i ] );
			return 0;
		}

		while( 1 ){
			Line = String(file.ReadLine());
			if( file.IsEOF()) break;

			if( Line.substr( 0, 6 ) == "[data]" ){
				break;
			}
		}


		while( 1 ){
			Line = file.ReadLine();
			if( file.IsEOF()) break;
			//[column names]
			//sats time lat long velocity heading height longacc latacc device_update_rate lean_angle combined_acc fix_type accuracy

			var Param = Line.split( " " );
			

			if( Param[ 1 ] == '' 
			|| Param[ 2 ] == ''
			|| Param[ 3 ] == '') continue;
			
			var Time	= Param[ 1 ];
			var Hour	= ~~( Time / 10000 );
			var Min		= ~~( Time / 100 ) % 100;
			var Sec		= ~~Time % 100;
			var Milli	= ~~( Time * 1000 ) % 1000;
			
			//datetime 相当の情報がない…？
			var Day		= 1;
			var Mon		= 1;
			var Year	= 2000;
			
			Log.Time[ Cnt ]	= new Date(Date.UTC( Year, Mon - 1, Day, Hour, Min, Sec, Milli ));
			
			var Long = +Param[ 3 ];
			Long = ~~( Long / 100 ) + ( Long % 100 / 60 );
			
			var Lati = +Param[ 2 ];
			Lati = ~~( Lati / 100 ) + ( Lati % 100 / 60 );
			//西経なので正負反転
			Log.Longitude[ Cnt ] = -Long;
			Log.Latitude [ Cnt ] = Lati;
			
			
			// Speed がある場合は Array 作成
			if( Param[ 4 ] != '' ){
				Log.Speed[ Cnt ] = +Param[ 4 ] ;
			}
			Log.Direction[Cnt] = Param[ 5 ]
			Log.Altitude[Cnt] = Param[ 6 ]
			++Cnt;
		}
		file.Close();

	}
	
	return Cnt ? Cnt : INVALID_FORMAT;
}

// 旅行日程データ
const scheduleData = {
  schedule: [
    {
      date: "2024-11-03",
      dateLabel: "11月3日（月曜日）",
      items: [
        {
          id: "item-1",
          time: "6:30",
          activity: "羽田第1ターミナル第3時計台に集合",
          note: "朝食は各自用意をしておく、帰りのチケットを配布",
          checked: false,
          location: {
            name: "羽田空港第1ターミナル",
            lat: 35.5494,
            lng: 139.7798,
            address: "東京都大田区羽田空港"
          }
        },
        {
          id: "item-2",
          time: "7:30",
          activity: "離陸",
          checked: false
        },
        {
          id: "item-3",
          time: "8:40",
          activity: "大阪伊丹空港着",
          checked: false,
          location: {
            name: "大阪伊丹空港",
            lat: 34.7856,
            lng: 135.4378
          }
        },
        {
          id: "item-4",
          time: "9:55",
          activity: "大阪伊丹空港発",
          checked: false
        },
        {
          id: "item-5",
          time: "11:55",
          activity: "奄美大島空港",
          checked: false,
          location: {
            name: "奄美大島空港",
            lat: 28.4314,
            lng: 129.7125
          }
        },
        {
          id: "item-6",
          time: "12:30",
          activity: "レンタカー乗車",
          note: "10人乗りなのでゆったりです",
          checked: false
        },
        {
          id: "item-7",
          time: "13:00",
          activity: "昼食 海工房（海を見ながら）",
          checked: false,
          location: {
            name: "海工房",
            lat: 28.3764,
            lng: 129.4957,
            address: "鹿児島県大島郡瀬戸内町"
          },
          website: "https://example.com/kaikoubou",
          type: "restaurant"
        },
        {
          id: "item-8",
          time: "13:30",
          activity: "シュノーケリング ネイティブシティ奄美",
          checked: false,
          location: {
            name: "ネイティブシティ奄美",
            lat: 28.3633,
            lng: 129.4817
          },
          website: "https://example.com/native-city",
          type: "activity"
        },
        {
          id: "item-9",
          time: "15:30",
          activity: "終了 ハートロックへ",
          checked: false,
          location: {
            name: "ハートロック",
            lat: 28.3583,
            lng: 129.4750
          },
          type: "sightseeing"
        },
        {
          id: "item-10",
          time: "17:30",
          activity: "オンシェアー サンセットクルーズ",
          checked: false,
          location: {
            name: "オンシェアー",
            lat: 28.3633,
            lng: 129.4850
          },
          website: "https://example.com/onshare",
          type: "activity"
        },
        {
          id: "item-11",
          time: "19:00",
          activity: "終了 ホテルカレッタへ",
          checked: false,
          location: {
            name: "ホテルカレッタ",
            lat: 28.3717,
            lng: 129.4883,
            address: "鹿児島県大島郡龍郷町芦徳419-1"
          },
          website: "https://example.com/hotel-caletta",
          type: "hotel"
        },
        {
          id: "item-12",
          time: "19:30",
          activity: "チェックイン",
          note: "0997-62-3821",
          checked: false
        },
        {
          id: "item-13",
          time: "18:00",
          activity: "外食 近くの鳥料理店？",
          checked: false,
          type: "restaurant"
        }
      ]
    },
    {
      date: "2024-11-04",
      dateLabel: "11月4日（火曜日）",
      items: [
        {
          id: "item-14",
          time: "7:30",
          activity: "朝食",
          note: "そのまま出発出来るように準備",
          checked: false
        },
        {
          id: "item-15",
          time: "8:00",
          activity: "ホテル出発<br>観光 名瀬方面ドライブ",
          checked: false
        },
        {
          id: "item-16",
          time: "9:30",
          activity: "金作原原生林ツアー 2時間",
          checked: false,
          location: {
            name: "金作原原生林",
            lat: 28.3967,
            lng: 129.5233
          },
          website: "https://example.com/kinsakubaru",
          type: "sightseeing"
        },
        {
          id: "item-17",
          time: "12:00",
          activity: "鶏飯 ひさ倉",
          checked: false,
          location: {
            name: "ひさ倉",
            lat: 28.3989,
            lng: 129.4950
          },
          website: "https://example.com/hisakura",
          type: "restaurant"
        },
        {
          id: "item-18",
          time: "13:15",
          activity: "大浜海浜公園か奄美博物館",
          checked: false,
          location: {
            name: "大浜海浜公園",
            lat: 28.4050,
            lng: 129.4883
          },
          type: "sightseeing"
        },
        {
          id: "item-19",
          time: "15:00",
          activity: "ホテルウエストコート本館チェックイン",
          note: "0977-52-8080",
          checked: false,
          location: {
            name: "ホテルウエストコート本館",
            lat: 28.4183,
            lng: 129.4967
          },
          type: "hotel"
        },
        {
          id: "item-20",
          time: "15:20",
          activity: "マングローブパークへ",
          checked: false,
          location: {
            name: "マングローブパーク",
            lat: 28.4217,
            lng: 129.5033
          },
          type: "sightseeing"
        },
        {
          id: "item-21",
          time: "16:00",
          activity: "サンセットマングローブツアーと黒兎探検ツアー",
          checked: false,
          website: "https://example.com/mangrove-tour",
          type: "activity"
        },
        {
          id: "item-22",
          time: "19:30",
          activity: "終了",
          checked: false
        },
        {
          id: "item-23",
          time: "20:00",
          activity: "夕食 どこか予約するか居酒屋みたいなところに飛び込みか",
          checked: false,
          type: "restaurant"
        }
      ]
    },
    {
      date: "2024-11-05",
      dateLabel: "11月5日（水曜日）",
      items: [
        {
          id: "item-24",
          time: "8:00",
          activity: "朝食",
          note: "そのまま出発出来るように準備（疲れているのでちょっと遅く）",
          checked: false
        },
        {
          id: "item-25",
          time: "8:30",
          activity: "ホテル出発<br>観光 現地車中で相談 土森海岸観光やお土産等",
          checked: false
        },
        {
          id: "item-26",
          time: "12:00",
          activity: "昼食 きよら海工房または奄美ブルー",
          checked: false,
          location: {
            name: "きよら海工房",
            lat: 28.3764,
            lng: 129.4957
          },
          type: "restaurant"
        },
        {
          id: "item-27",
          time: "13:10",
          activity: "奄美大島空港へ",
          checked: false
        },
        {
          id: "item-28",
          time: "13:20",
          activity: "レンタカー返却",
          checked: false
        },
        {
          id: "item-29",
          time: "14:30",
          activity: "羽田空港へ離陸",
          checked: false
        },
        {
          id: "item-30",
          time: "16:25",
          activity: "<strong>羽田空港着 お疲れさまでした</strong>",
          checked: false
        },
        {
          id: "item-31",
          time: "18:30",
          activity: "池袋駅発 ラビュー",
          checked: false
        },
        {
          id: "item-32",
          time: "19:05",
          activity: "入間市駅着",
          checked: false
        }
      ]
    }
  ],
  lastUpdated: new Date().toISOString(),
  version: 1
};

// ツアー内容データ
const tourContent = {
  members: {
    title: "👥 参加メンバー",
    list: "岡部夫婦・伊藤夫婦・今井夫婦・小野夫婦",
    count: "計8名"
  },
  purpose: {
    title: "🎯 今回の旅の目的",
    items: [
      "奄美大島の自然を存分に満喫する",
      "今回は全員海中の自然を楽しむのでウミガメに出会えることを祈る 🐢",
      "このメンバーであと何回行けるかわからない旅行をかみしめる"
    ]
  },
  warnings: {
    title: "⚠️ 注意事項",
    items: [
      "各自健康には十分注意し、任意ではありますが帯状疱疹・インフルエンザの予防注射は打っておく",
      "大島のように不測の事態も想定し下着は余分に持っていく",
      "このしおりには本音とジョークが混ざっているのでしっかり判断する",
      "絶対に喧嘩をしない"
    ]
  },
  roles: {
    title: "👨‍💼 係分担",
    description: "各係の言うことは必ずきく。不満があるときは班長に訴える",
    items: [
      {
        title: "班長：小野父",
        note: "（班長は持ち回りです）",
        description: "全体をまとめ、楽しい旅行となるよう配慮する。しっかり責任は取る。<br><em>班長が道やルートを間違えたらコッソリ文句を言う</em>"
      },
      {
        title: "風紀係：伊藤父",
        description: "最も重要な係、全体が羽目を外さないよう又途中で寝ないよう見張る。<br><strong>助手席は絶対に寝ないように指導</strong>"
      },
      {
        title: "宴会係：岡部父",
        description: "主に宴会時の飲み物つまみを確保。自分は飲まないからと言って手を抜かない。<br><strong>当然2日間やる気合いを見せる</strong>"
      },
      {
        title: "YouTube係：小野母",
        description: "事前にYouTubeをよく見ておき有益な情報をGetする"
      },
      {
        title: "会計係：岡部母",
        description: "毎回費用を記録し、公正に努める。<br><em>間違っても岡部家に有利にしてはいけない。</em><br>勿論PayPayが自在に使えるよう"
      },
      {
        title: "食事係：今井母",
        description: "各食事の時間、場所の確認。遅れたり間違えた参加者には厳しく指導。<br><strong>勿論残さず食べさせる</strong>"
      },
      {
        title: "お助け係：伊藤母",
        description: "いわゆる各係の仕事を監視し、大変な所をサポートする"
      },
      {
        title: "副班長：今井父",
        description: "固定になってしまいますがよろしくお願いいたします"
      }
    ]
  },
  items: {
    title: "🎒 持ち物",
    items: [
      "お小遣い（2万円）",
      "2泊なので着替え（不測の事態に備えて多めで）",
      "不要物は持ってこないように",
      "今回、帰りは電車なので大丈夫とは思いますが柔軟に対応できるご準備を"
    ]
  }
};

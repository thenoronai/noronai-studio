# NöronAI Studio

**Hafızalı "What If" video stüdyosu.** Bir konudan ya da belgeden, çöp adam karakterli ve tek
anlatıcılı bir What If videosu üretir. Her bölümde kanalının kurallarını, kullandığın konuları,
karakterleri ve öğrendiği dersleri kendi notlarına yazar. Onuncu bölümde ilk bölümde bilmediği her
şeyi bilir ve hiçbir şeyi tekrar etmez.

[English](README.en.md) · [Mimari](docs/MIMARI.md) · [MIT lisansı](LICENSE)

NöronAI Studio, [@Avenoxai](https://x.com/Avenoxai)'ın açık kaynak
[AvenoxBeyin](https://github.com/avenoxai/avenoxbeyin) ikinci beyin sistemi üzerine kurulu bir
eklentidir. Hafızayı AvenoxBeyin tutar, üretimi NöronAI Studio yapar.

## Ne yapar?

| Adım | Ne olur |
| --- | --- |
| **Konu** | Daha önce yapılmamış 10 What If konusu önerir ya da senin başlığınla başlar |
| **Senaryo** | Tek anlatıcılı, "sen" diye anlatılan, süreye göre ölçülmüş senaryo |
| **Ses** | Seçtiğin TTS sesiyle seslendirme, cümle zamanlaması |
| **Tasarım** | Senaryodan karakter, mekân, oyunculuk ve ses brifi |
| **Kadro** | Her bölüme özel karakterler; onayına sunulan kadro sayfası |
| **Kurgu** | Three.js + Remotion ile çekimler, efektler, ses tasarımı |
| **Kalite** | Donma, siyah kare, havada duran nesne ve tekrar kontrolü |
| **Render** | 4K uzun video ya da dikey Shorts |
| **Hafıza** | Konu, karakter, kütüphane kullanımı ve dersler kasana yazılır |

## Neden hafıza?

Video üreten ajanlar her sohbette sıfırdan başlar: aynı hatayı tekrar yapar, aynı karakteri
yeniden giydirir, aynı konuyu yeniden önerir. NöronAI Studio bunları vault'undaki bir **Stüdyo
defterine** yazar:

| Defter | Ne tutar |
| --- | --- |
| `Kanal.md` | Ton, anlatıcı sesi, okuma hızı, yasaklar, güncel tarz özeti |
| `Kullanilan-Konular.md` | Yapılmış her konu; yenisi önerilirken tekrar etmez |
| `Kadro.md` | Her karakterin onaylı görünüşü |
| `Kullanim-Gunlugu.md` | Bölüm bölüm kullanılan set, kıyafet, aksesuar, hareket ve ses |
| `Dersler.md` | Düzeltmelerin ve kalite hataları, tarihli |

Render'dan önce `araclar/cesitlilik.py` bu günlüğü okuyup tekrar kurallarını denetler: ana
karakterin görünüşü tekrar edemez, son üç bölümün setleri ve kıyafetleri kullanılamaz, her bölüm
kütüphaneye yeni öğeler eklemek zorundadır.

## Kurulum

**Gerekenler:** [AvenoxBeyin](https://github.com/avenoxai/avenoxbeyin) kurulu bir vault,
Claude Code ya da Codex gibi bir AI istemcisi, Node.js 22+, Python 3.11+, FFmpeg ve Chrome.

1. AvenoxBeyin'i [kendi kurulum adımlarıyla](https://github.com/avenoxai/avenoxbeyin#kurulum) kur.
2. Bu repoyu indir (yeşil **Code** düğmesi › **Download ZIP**) ve bir klasöre aç.
3. Vault klasöründe:

   ```sh
   python3 beyin.py skill-import --source /yol/noronai-studio/whatif-studyo
   ```

4. Ajanına **"stüdyoyu kur"** de. Ön koşulları kontrol eder, defteri kurar ve kanalın hakkında
   birkaç soru sorar.

## Kullanım

| Ajanına söyle | Ne olur |
| --- | --- |
| "Yeni bir What If konusu üret" | Daha önce yapılmamış 10 konu |
| "3 numara, 10 dakika" | Senaryo, ardından üretim hattı |
| "Bu belgeden shorts yap" | Dikey, 60 saniyeye kadar bir Shorts |
| "Çeşitlilik kontrolünü çalıştır" | Tekrar kurallarının denetimi |
| "Kanal defterini göster" | Stüdyonun kanalın hakkında bildikleri |

## Güvenlik ve gizlilik

- Repoda ve defterde **API anahtarı yoktur**. Seslendirme anahtarını kendi makinende ortam
  değişkeni olarak tutarsın; ajan onu sohbete yazdırmaz, dosyaya kaydetmez.
- Ağır dosyalar (ses, render, kütüphane) vault'a girmez; stüdyo klasöründe durur.
- Yayınlama, yükleme ve ücretli servisler her zaman senin onayını ister.

## Katkı ve teşekkür

- Hafıza katmanı ve defter yaklaşımı: [AvenoxBeyin](https://github.com/avenoxai/avenoxbeyin) ve
  onun `video-motoru` paketi, [@Avenoxai](https://x.com/Avenoxai) (MIT). Ayrıntılar:
  [NOTICE.md](NOTICE.md).
- Üretim hattı: Yayınlanmış gerçek bölümlerde geliştirilip sınandı.

Geliştiren: [@thenoronai](https://x.com/thenoronai) · Nöron Zeka

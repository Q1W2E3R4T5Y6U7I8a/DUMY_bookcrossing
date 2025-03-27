import { View, TouchableOpacity, Modal, Text, StyleSheet, Image } from 'react-native';
import { Link, useSegments } from 'expo-router';
import React, { useState, useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';

export default function Header() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalText, setModalText] = useState('');
  const [isHeartActive, setIsHeartActive] = useState(false);
  const { language, setLanguage } = useContext(LanguageContext);
  const segments = useSegments();

  const currentPage = segments[segments.length - 1];

  const getInfoIcon = () => {
    switch (currentPage) {
      case 'main':
        return require('../../assets/info_icon.png');
      case 'dumy':
        return require('../../assets/info_icon_blue.png');
      case 'books':
        return require('../../assets/info_icon_yellow.png');
      default:
        return require('../../assets/info_icon.png');
    }
  };

  const handleUkrainianPress = () => {
    setLanguage('ukrainian');
  };

  const handleEnglishPress = () => {
    setLanguage('english');
  };

  const handleFrenchPress = () => {
    setLanguage('french');
  };

  const showModal = (text) => {
    setModalText(text);
    setIsModalVisible(true);
  };

  const handleInfoPress = () => {
    const infoText = getInfoText();
    showModal(infoText[language]); 
  };

    const getInfoText = () => {
      switch (currentPage) {
        case 'dumy':
          return {
            ukrainian: 'Всі мають доступ до виставлення нових постів, проте якщо ви бажаєте видалити або редагувати пост, напишіть будь ласка в телеграм @sofiya_shevchenko21',
            english: 'English text',
            french: 'French',
          };
        case 'books':
          return {
            ukrainian:'В Коломиї є неймовірна кав\'ярня "Букініст", завдяки якій, будучи школярем я прочитав сотні книг, в них була проста і геніальна ідея. Я давав їм 100 грн на "депозит", брав книгу, а коли повертав її, то забирав свої 100 грн.\n\n' +
            'Ця ж сама ідея тут. Проте ця ідея класна для підлітків, для яких 200грн щотижня - це не під\'ємна сума. Але якщо для вас важливо мати СВОЮ книгу, добавити її в СВОЮ бібліотеку, тут можна стати тим, хто поділиться з іншими.\n\n' +
            'Я ще хз як до кінця цей додаток має виглядати, це лиш бета версія, але кінцева ціль це щоб люди більше читали, особливо молодь.',
            english: `We give and take FREE books, exchange them and promote bookcrossing. There is also possibilty to request "deposit" which is when u r giving book to read for free and when the book is read the deposit will be given back`,
            french: 'Nous donnons et prenons des livres GRATUITS, les échangeons et promouvons le bookcrossing. Il est également possible de demander un "dépôt" : vous prêtez un livre gratuitement, et une fois lu, le dépôt vous est restitué.',
          };
        default:
          return {
            ukrainian: `Надіюсь вам подобаються ДУМИ! У нас також є телеграм та ютуб канали "Думи", а в інстаграм "Кирило Мефодіївське Товариство", де ми проводимо квартирники. \n\n` +
              `Будемо вдячні за підписку, поширення, відгук в плеймаркеті, побажання, погрози чи закрутки (особливо цінимо малинове варення). \n\n` +
              `Шукаємо в команду більше людей, маркетологів, копірайтерів, девелоперів, смачних булочок та менеджерів, пишіть і ставайте частиною проекту.`,
            english: `I hope you enjoy DUMY! We also have Telegram and YouTube channels "DUMY", and on Instagram "Kyrylo Methodius Society", where we host apartment concerts. \n\n` +
              `We would appreciate your subscription, sharing, feedback on the Play Market, suggestions, threats, or preserves (especially raspberry jam). \n\n` +
              `We are looking for more people to join the team: marketers, copywriters, developers, tasty buns, and managers. Write to us and become part of the project.`,
            french: `J'espère que vous appréciez DUMY ! Nous avons également des chaînes Telegram et YouTube "DUMY", et sur Instagram "Société Kyrylo Méthodius", où nous organisons des concerts d'appartement. \n\n` +
              `Nous apprécierions votre abonnement, partage, retour sur le Play Market, suggestions, menaces ou conserves (surtout la confiture de framboises). \n\n` +
              `Nous recherchons plus de personnes pour rejoindre l'équipe : marketeurs, rédacteurs, développeurs, délicieux petits pains et managers. Écrivez-nous et devenez partie du projet.`,
          };
      }
    };

  const heartMessages = {
    ukrainian: [
    "Всесвіт любить тебе. Особливо якщо ти Григорій. Якщо ти Арестович то не все так однозначно",
    "Не забувай пити достатньо води!",
    "Чай завжди краще з лимоном. Факт.",
    "Тобі відкриється сенс життя. Але не одразу. І, можливо, не той сенс, який ти хотів.",
    "На справді ти в комі від Коронавірусу з 2019-го, це все сон",
    "Поділися думами, щоб твої друзі теж відчули цей солодкий, короткий момент відволікання від власної смертності",
    "Всесвіт тебе підтримує. Але не настільки, щоб вирішувати твої проблеми.",
    "Сенс життя — це просто набір слів. Як і ця фраза. Реальний сенс не в фразі.",
    "Якщо тобі здається, що світ змовився проти тебе… Повір, він просто зайнятий важливішими речами.",
    "Ця мить ніколи не повториться. І що з того?",
    "Якщо ти читаєш це – значить, ти ще живий. Непоганий результат.",
    "Ти особливий. Як і всі 8 мільярдів людей і ще ∞ матерій",
    "Думки матеріальні. Особливо ті, які ти не встиг записати й забув.",
    "Твоє минуле не визначає тебе. А от борги – можуть.",
    "Головне – бути собою. Навіть якщо 'собою' бути трохи ніяково.",
    "Ти не помиляєшся. Просто створюєш альтернативну реальність, де це був хороший вибір.",
    "Не варто жити минулим. Майбутнє теж тебе розчарує.",
    "Ти не самотній. Всесвіт теж в процесі пошуку себе. А, ой, ти ж і є всесвіт, тільки не спойлери нікому",
    "Кожен помирає, але не кожен живе",
    "Чи готовий ти втратити свободу зараз заради свободи потім?",
    "Ти вже зробив перший крок, тепер зроби ще 50^50",
    "Всі ці питання без відповідей… Тільки не забудь, що ти — це теж відповідь.",
    "Ми всі однакові. Тільки різними мовами говоримо про одне й те саме."
  ],
  english: [
    "The universe loves you. Especially if you're Grigory. If you're Arestovych, it's not so clear.",
    "Don't forget to drink enough water!",
    "Tea is always better with lemon. Fact.",
  ],
  french: [
    "L'univers t'aime. Surtout si tu es Grigory. Si tu es Arestovych, ce n'est pas si clair.",
    "N'oublie pas de boire assez d'eau !",
    "Le thé est toujours meilleur avec du citron. C'est un fait.",
  ],
}

const handleHeartPress = () => {
  setIsHeartActive(!isHeartActive);
  const randomMessage = heartMessages[language][Math.floor(Math.random() * heartMessages[language].length)];
  showModal(randomMessage);
};

  return (
    <View style={styles.header}>
      <TouchableOpacity hitSlop={10} onPress={handleInfoPress}>
        <Image source={getInfoIcon()} style={styles.icon} />
      </TouchableOpacity>

        <TouchableOpacity hitSlop={10} onPress={handleEnglishPress}>
          <Image
            source={require('../../assets/english_flag.png')}
            style={[
              styles.lg_icon,
              language === 'english' && styles.activeLanguage
            ]}
          />
        </TouchableOpacity>

        <TouchableOpacity hitSlop={10} onPress={handleUkrainianPress}>
          <Image
            source={require('../../assets/ukrainian_flag.png')}
            style={[
              styles.lg_icon,
              language === 'ukrainian' && styles.activeLanguage
            ]}
          />
        </TouchableOpacity>

        <TouchableOpacity hitSlop={10} onPress={handleFrenchPress}>
          <Image
            source={require('../../assets/french_flag.png')}
            style={[
              styles.lg_icon,
              language === 'french' && styles.activeLanguage
            ]}
          />
        </TouchableOpacity>

      <View style={styles.rightIcons}>
        <Link href="/favorites" asChild>
          <TouchableOpacity style={styles.iconButton}>
            <Image source={require('../../assets/star_icon.png')} style={styles.icon} />
          </TouchableOpacity>
        </Link>

        <TouchableOpacity hitSlop={5} onPress={handleHeartPress}>
          <Image
            source={isHeartActive ? require('../../assets/heart_icon_active.png') : require('../../assets/heart_icon.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      {/* Custom Modal */}
      <Modal transparent={true} animationType="fade" visible={isModalVisible}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalText}>{modalText}</Text>
            <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Х</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#b7b6af',
  },
  lg_icon: {
    width: 24, 
    height: 24,
    opacity: 0.5,
    resizeMode: 'contain',
    borderRadius: 12,
  },
  activeLanguage: {
    opacity: 1,
    borderWidth: 2.5,
    borderColor: '#000',
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  rightIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  iconButton: {
    marginRight: 16,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#171716',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

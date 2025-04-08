'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert(
      'Users',
      [
        {
          name: 'q',
          surname: 'w',
          birthDate: '03.07.1987',
          email: 'q@q',
          password: await bcrypt.hash('111111', 10),
          trener: true,
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'w',
          surname: 't',
          birthDate: '03.07.1990',
          email: 'w@w',
          password: await bcrypt.hash('111111', 10),
          trener: false,
          createdAt: now,
          updatedAt: now,
        },
      ],
      {},
    );

    await queryInterface.bulkInsert(
      'Exercises',
      [
        {
          name: 'Приседания со штангой',
          description: 'Базовое упражнение для развития мышц ног',
          category: 'Ноги',
          difficulty: 'intermediate',
          muscle_groups: ['Квадрицепсы', 'Ягодицы'],
          equipment: 'Штанга',
          image: '/excercises/squat.jpeg',
          exercise_type: 'compound',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Жим штанги лежа',
          description: 'Базовое упражнение для развития грудных мышц',
          category: 'Грудь',
          difficulty: 'intermediate',
          muscle_groups: ['Грудные мышцы', 'Трицепсы'],
          equipment: 'Штанга',
          image: '/excercises/bench-press.jpg',
          exercise_type: 'compound',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Подтягивания',
          description: 'Базовое упражнение для развития мышц спины',
          category: 'Спина',
          difficulty: 'advanced',
          muscle_groups: ['Широчайшие мышцы спины', 'Бицепсы'],
          equipment: 'Турник',
          image: '/excercises/pull-ups.jpg',
          exercise_type: 'bodyweight',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Становая тяга',
          description: 'Базовое упражнение для развития мышц спины и ног',
          category: 'Спина',
          difficulty: 'advanced',
          muscle_groups: ['Поясница', 'Бицепс бедра'],
          equipment: 'Штанга',
          image: '/excercises/deadlift.png',
          exercise_type: 'compound',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Жим гантелей на наклонной скамье',
          description: 'Упражнение для проработки верхней части груди',
          category: 'Грудь',
          difficulty: 'intermediate',
          muscle_groups: ['Верх грудных', 'Передние дельты'],
          equipment: 'Гантели, скамья',
          image: '/excercises/incline-dumbbell-press.jpg',
          exercise_type: 'compound',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Разводка гантелей лежа',
          description: 'Изолирующее упражнение для растяжки и проработки грудных',
          category: 'Грудь',
          difficulty: 'beginner',
          muscle_groups: ['Грудные мышцы'],
          equipment: 'Гантели',
          image: '/excercises/dumbbell-fly.jpg',
          exercise_type: 'isolation',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Отжимания на брусьях (акцент на грудь)',
          description: 'Упражнение для развития нижней части груди и трицепсов',
          category: 'Грудь',
          difficulty: 'advanced',
          muscle_groups: ['Ниж грудных', 'Трицепсы'],
          equipment: 'Брусья',
          image: '/excercises/dips.jpg',
          exercise_type: 'bodyweight',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Кроссовер через верхние блоки',
          description: 'Изолирующее упражнение для детализации грудных',
          category: 'Грудь',
          difficulty: 'intermediate',
          muscle_groups: ['Грудные мышцы'],
          equipment: 'Кроссовер',
          image: '/excercises/cable-crossover.jpg',
          exercise_type: 'isolation',
          createdAt: now,
          updatedAt: now,
        },
      
        
        {
          name: 'Тяга штанги в наклоне',
          description: 'Базовое упражнение для толщины спины',
          category: 'Спина',
          difficulty: 'intermediate',
          muscle_groups: ['Широчайшие', 'Ромбовидные', 'Трапеции'],
          equipment: 'Штанга',
          image: '/excercises/barbell-row.jpg',
          exercise_type: 'compound',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Тяга гантели одной рукой',
          description: 'Упражнение для детальной проработки спины',
          category: 'Спина',
          difficulty: 'intermediate',
          muscle_groups: ['Широчайшие', 'Ромбовидные'],
          equipment: 'Гантеля, скамья',
          image: '/excercises/single-dumbbell-row.jpg',
          exercise_type: 'compound',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Горизонтальная тяга в блочном тренажере',
          description: 'Упражнение для проработки середины спины',
          category: 'Спина',
          difficulty: 'beginner',
          muscle_groups: ['Широчайшие', 'Ромбовидные'],
          equipment: 'Тренажер',
          image: '/excercises/seated-cable-row.jpg',
          exercise_type: 'compound',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Гиперэкстензия',
          description: 'Упражнение для укрепления поясницы',
          category: 'Спина',
          difficulty: 'beginner',
          muscle_groups: ['Разгибатели спины'],
          equipment: 'Скамья для гиперэкстензии',
          image: '/excercises/hyperextension.jpg',
          exercise_type: 'isolation',
          createdAt: now,
          updatedAt: now,
        },
      
        {
          name: 'Выпады с гантелями',
          description: 'Упражнение для проработки квадрицепсов и ягодиц',
          category: 'Ноги',
          difficulty: 'beginner',
          muscle_groups: ['Квадрицепсы', 'Ягодицы'],
          equipment: 'Гантели',
          image: '/excercises/lunges.jpg',
          exercise_type: 'compound',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Жим ногами',
          description: 'Упражнение в тренажере для квадрицепсов и ягодиц',
          category: 'Ноги',
          difficulty: 'beginner',
          muscle_groups: ['Квадрицепсы', 'Ягодицы'],
          equipment: 'Тренажер',
          image: '/excercises/leg-press.jpg',
          exercise_type: 'compound',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Подъем на носки стоя',
          description: 'Упражнение для икроножных мышц',
          category: 'Ноги',
          difficulty: 'beginner',
          muscle_groups: ['Икроножные'],
          equipment: 'Тренажер или штанга',
          image: '/excercises/calf-raise.jpg',
          exercise_type: 'isolation',
          createdAt: now,
          updatedAt: now,
        },
      
        // Плечи
        {
          name: 'Армейский жим',
          description: 'Базовое упражнение для развития дельт',
          category: 'Плечи',
          difficulty: 'intermediate',
          muscle_groups: ['Передние дельты', 'Средние дельты'],
          equipment: 'Штанга',
          image: '/excercises/overhead-press.jpg',
          exercise_type: 'compound',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Жим гантелей сидя',
          description: 'Упражнение для развития плечевого пояса',
          category: 'Плечи',
          difficulty: 'intermediate',
          muscle_groups: ['Передние дельты', 'Средние дельты'],
          equipment: 'Гантели, скамья',
          image: '/excercises/dumbbell-shoulder-press.jpg',
          exercise_type: 'compound',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Махи гантелями в стороны',
          description: 'Изолирующее упражнение для средних дельт',
          category: 'Плечи',
          difficulty: 'beginner',
          muscle_groups: ['Средние дельты'],
          equipment: 'Гантели',
          image: '/excercises/lateral-raise.png',
          exercise_type: 'isolation',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Тяга штанги к подбородку',
          description: 'Упражнение для трапеций и средних дельт',
          category: 'Плечи',
          difficulty: 'intermediate',
          muscle_groups: ['Трапеции', 'Средние дельты'],
          equipment: 'Штанга',
          image: '/excercises/upright-row.jpg',
          exercise_type: 'compound',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Разводка в наклоне',
          description: 'Упражнение для задних дельт',
          category: 'Плечи',
          difficulty: 'intermediate',
          muscle_groups: ['Задние дельты'],
          equipment: 'Гантели',
          image: '/excercises/rear-delt-fly.jpg',
          exercise_type: 'isolation',
          createdAt: now,
          updatedAt: now,
        },
      
        // Руки (Бицепс / Трицепс)
        {
          name: 'Подъем штанги на бицепс',
          description: 'Базовое упражнение для бицепса',
          category: 'Руки',
          difficulty: 'beginner',
          muscle_groups: ['Бицепс'],
          equipment: 'Штанга',
          image: '/excercises/barbell-curl.png',
          exercise_type: 'isolation',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Молотковые сгибания',
          description: 'Упражнение для брахиалиса и бицепса',
          category: 'Руки',
          difficulty: 'beginner',
          muscle_groups: ['Бицепс', 'Брахиалис'],
          equipment: 'Гантели',
          image: '/excercises/hammer-curl.png',
          exercise_type: 'isolation',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Отжимания на брусьях (акцент на трицепс)',
          description: 'Упражнение для развития трицепсов',
          category: 'Руки',
          difficulty: 'advanced',
          muscle_groups: ['Трицепс'],
          equipment: 'Брусья',
          image: '/excercises/triceps-dips.jpg',
          exercise_type: 'bodyweight',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Французский жим лежа',
          description: 'Изолирующее упражнение для трицепса',
          category: 'Руки',
          difficulty: 'intermediate',
          muscle_groups: ['Трицепс'],
          equipment: 'Штанга, скамья',
          image: '/excercises/skull-crushers.png',
          exercise_type: 'isolation',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Разгибание рук на блоке',
          description: 'Упражнение для проработки трицепса',
          category: 'Руки',
          difficulty: 'beginner',
          muscle_groups: ['Трицепс'],
          equipment: 'Кроссовер',
          image: '/excercises/triceps-pushdown.png',
          exercise_type: 'isolation',
          createdAt: now,
          updatedAt: now,
        },
      
        // Пресс
        {
          name: 'Скручивания',
          description: 'Базовое упражнение для пресса',
          category: 'Пресс',
          difficulty: 'beginner',
          muscle_groups: ['Прямая мышца живота'],
          equipment: 'Коврик',
          image: '/excercises/crunches.jpg',
          exercise_type: 'bodyweight',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Планка',
          description: 'Упражнение для стабилизации корпуса',
          category: 'Пресс',
          difficulty: 'intermediate',
          muscle_groups: ['Прямая мышца живота', 'Косые', 'Поперечная'],
          equipment: 'Коврик',
          image: '/excercises/plank.jpg',
          exercise_type: 'bodyweight',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Подъем ног в висе',
          description: 'Упражнение для нижнего пресса',
          category: 'Пресс',
          difficulty: 'advanced',
          muscle_groups: ['Прямая мышца живота'],
          equipment: 'Турник',
          image: '/excercises/hanging-leg-raise.jpg',
          exercise_type: 'bodyweight',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Русские скручивания',
          description: 'Упражнение для косых мышц живота',
          category: 'Пресс',
          difficulty: 'intermediate',
          muscle_groups: ['Косые мышцы'],
          equipment: 'Коврик, мяч (опционально)',
          image: '/excercises/russian-twist.jpeg',
          exercise_type: 'bodyweight',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Велосипед',
          description: 'Упражнение для комплексной проработки пресса',
          category: 'Пресс',
          difficulty: 'intermediate',
          muscle_groups: ['Прямая мышца', 'Косые'],
          equipment: 'Коврик',
          image: '/excercises/bicycle-crunch.jpg',
          exercise_type: 'bodyweight',
          createdAt: now,
          updatedAt: now,
        },
      
        // Кардио
        {
          name: 'Бег на дорожке',
          description: 'Кардиоупражнение для выносливости',
          category: 'Кардио',
          difficulty: 'beginner',
          muscle_groups: ['Ноги', 'Сердечно-сосудистая система'],
          equipment: 'Беговая дорожка',
          image: '/excercises/treadmill.jpg',
          exercise_type: 'cardio',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Прыжки на скакалке',
          description: 'Высокоинтенсивное кардио',
          category: 'Кардио',
          difficulty: 'intermediate',
          muscle_groups: ['Икры', 'Сердечно-сосудистая система'],
          equipment: 'Скакалка',
          image: '/excercises/jump-rope.jpeg',
          exercise_type: 'cardio',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Гребной тренажер',
          description: 'Кардио с вовлечением мышц спины и ног',
          category: 'Кардио',
          difficulty: 'intermediate',
          muscle_groups: ['Спина', 'Ноги', 'Сердечно-сосудистая система'],
          equipment: 'Гребной тренажер',
          image: '/excercises/rowing-machine.png',
          exercise_type: 'cardio',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Берпи',
          description: 'Функциональное упражнение для всего тела',
          category: 'Кардио',
          difficulty: 'advanced',
          muscle_groups: ['Ноги', 'Грудь', 'Плечи', 'Пресс'],
          equipment: 'Нет',
          image: '/excercises/burpee.jpg',
          exercise_type: 'bodyweight',
          createdAt: now,
          updatedAt: now,
        },
        
        {
          name: 'Пуловер с гантелью',
          description: 'Упражнение для растяжки грудных и развития широчайших',
          category: 'Грудь',
          difficulty: 'intermediate',
          muscle_groups: ['Грудные', 'Широчайшие'],
          equipment: 'Гантель, скамья',
          image: '/excercises/dumbbell-pullover.jpg',
          exercise_type: 'compound',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Отжимания с узкой постановкой рук',
          description: 'Акцент на трицепсы и внутреннюю часть груди',
          category: 'Грудь',
          difficulty: 'beginner',
          muscle_groups: ['Грудные', 'Трицепсы'],
          equipment: 'Нет',
          image: '/excercises/close-grip-pushup.png',
          exercise_type: 'bodyweight',
          createdAt: now,
          updatedAt: now,
        },
        
        // Дополнение для Спины
        {
          name: 'Тяга верхнего блока широким хватом',
          description: 'Аналог подтягиваний для широчайших мышц',
          category: 'Спина',
          difficulty: 'beginner',
          muscle_groups: ['Широчайшие', 'Ромбовидные'],
          equipment: 'Верхний блок',
          image: '/excercises/lat-pulldown.png',
          exercise_type: 'compound',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Шраги со штангой',
          description: 'Упражнение для развития трапециевидных мышц',
          category: 'Спина',
          difficulty: 'intermediate',
          muscle_groups: ['Трапеции'],
          equipment: 'Штанга',
          image: '/excercises/barbell-shrug.jpg',
          exercise_type: 'isolation',
          createdAt: now,
          updatedAt: now,
        },
        
        // Дополнение для Ног
        {
          name: 'Болгарские сплит-приседания',
          description: 'Упражнение для односторонней проработки ног',
          category: 'Ноги',
          difficulty: 'advanced',
          muscle_groups: ['Квадрицепсы', 'Ягодицы'],
          equipment: 'Гантели, скамья',
          image: '/excercises/bulgarian-split-squat.jpg',
          exercise_type: 'compound',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Румынская тяга',
          description: 'Вариант становой тяги для бицепса бедра',
          category: 'Ноги',
          difficulty: 'intermediate',
          muscle_groups: ['Бицепс бедра', 'Ягодицы'],
          equipment: 'Штанга',
          image: '/excercises/romanian-deadlift.jpg',
          exercise_type: 'compound',
          createdAt: now,
          updatedAt: now,
        },
        
        // Дополнение для Плеч
        {
          name: 'Жим Арнольда',
          description: 'Вращательный жим для комплексной проработки дельт',
          category: 'Плечи',
          difficulty: 'intermediate',
          muscle_groups: ['Передние дельты', 'Средние дельты'],
          equipment: 'Гантели',
          image: '/excercises/arnold-press.jpg',
          exercise_type: 'compound',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Фронтальные подъемы гантелей',
          description: 'Изолированная проработка передних дельт',
          category: 'Плечи',
          difficulty: 'beginner',
          muscle_groups: ['Передние дельты'],
          equipment: 'Гантели',
          image: '/excercises/front-raise.png',
          exercise_type: 'isolation',
          createdAt: now,
          updatedAt: now,
        },
        
        // Дополнение для Рук
        {
          name: 'Концентрированные подъемы на бицепс',
          description: 'Пиковое сокращение бицепса в изолированной позиции',
          category: 'Руки',
          difficulty: 'intermediate',
          muscle_groups: ['Бицепс'],
          equipment: 'Гантель',
          image: '/excercises/concentration-curl.gif',
          exercise_type: 'isolation',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Алмазные отжимания',
          description: 'Отжимания с узкой постановкой рук для трицепса',
          category: 'Руки',
          difficulty: 'advanced',
          muscle_groups: ['Трицепс'],
          equipment: 'Нет',
          image: '/excercises/diamond-pushup.jpg',
          exercise_type: 'bodyweight',
          createdAt: now,
          updatedAt: now,
        },
        
        // Дополнение для Пресса
        {
          name: 'Скручивания с роликом',
          description: 'Усложненный вариант скручиваний с нестабильностью',
          category: 'Пресс',
          difficulty: 'advanced',
          muscle_groups: ['Прямая мышца живота'],
          equipment: 'Ролик для пресса',
          image: '/excercises/ab-wheel.jpg',
          exercise_type: 'isolation',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Боковая планка',
          description: 'Укрепление косых мышц и стабилизация корпуса',
          category: 'Пресс',
          difficulty: 'intermediate',
          muscle_groups: ['Косые', 'Поперечная мышца'],
          equipment: 'Коврик',
          image: '/excercises/side-plank.png',
          exercise_type: 'bodyweight',
          createdAt: now,
          updatedAt: now,
        },
        
        // Дополнение для Кардио
        {
          name: 'Скалолаз',
          description: 'Динамическое упражнение для всего тела',
          category: 'Кардио',
          difficulty: 'intermediate',
          muscle_groups: ['Пресс', 'Плечи', 'Ноги'],
          equipment: 'Нет',
          image: '/excercises/mountain-climber.jpg',
          exercise_type: 'bodyweight',
          createdAt: now,
          updatedAt: now,
        },
        {
          name: 'Бёрпи с прыжком',
          description: 'Усложненная версия бёрпи с плиометрическим элементом',
          category: 'Кардио',
          difficulty: 'advanced',
          muscle_groups: ['Всё тело'],
          equipment: 'Нет',
          image: '/excercises/burpee-jump.jpg',
          exercise_type: 'bodyweight',
          createdAt: now,
          updatedAt: now,
        },
        
        // Новая категория: Функциональные
        // {
        //   name: 'Турецкий подъем',
        //   description: 'Комплексное упражнение на координацию и силу',
        //   category: 'Функциональные',
        //   difficulty: 'advanced',
        //   muscle_groups: ['Плечи', 'Кор', 'Ноги'],
        //   equipment: 'Гиря',
        //   image: '/excercises/turkish-get-up.png',
        //   exercise_type: 'compound',
        //   createdAt: now,
        //   updatedAt: now,
        // },

        
        // Новая категория: Предплечья/Запястья
        {
          name: 'Сгибания запястий со штангой',
          description: 'Укрепление мышц предплечий',
          category: 'Предплечья',
          difficulty: 'beginner',
          muscle_groups: ['Предплечья'],
          equipment: 'Штанга',
          image: '/excercises/wrist-curl.png',
          exercise_type: 'isolation',
          createdAt: now,
          updatedAt: now,
        },

      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Exercises', null, {});
  },
};

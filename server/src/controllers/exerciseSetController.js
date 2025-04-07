const { ExerciseSet, ExerciseOfTraining } = require('../../db/models');

/**
 * Контроллер для управления подходами упражнений
 */
const ExerciseSetController = {
  /**
   * Получение всех подходов для упражнения в тренировке
   * @param {Object} req - Запрос
   * @param {Object} res - Ответ
   */
  async getExerciseSets(req, res) {
    try {
      const { exerciseOfTrainingId } = req.params;

      // Проверяем существование упражнения в тренировке
      const exerciseOfTraining = await ExerciseOfTraining.findByPk(exerciseOfTrainingId);
      if (!exerciseOfTraining) {
        return res.status(404).json({
          success: false,
          message: 'Упражнение в тренировке не найдено',
        });
      }

      // Получаем все подходы для упражнения
      const exerciseSets = await ExerciseSet.findAll({
        where: { exerciseOfTrainingId },
        order: [['setNumber', 'ASC']],
      });

      return res.status(200).json({
        success: true,
        data: exerciseSets,
      });
    } catch (error) {
      console.error('Ошибка при получении подходов:', error);
      return res.status(500).json({
        success: false,
        message: 'Ошибка при получении подходов',
        error: error.message,
      });
    }
  },

  /**
   * Получение одного подхода по ID
   * @param {Object} req - Запрос
   * @param {Object} res - Ответ
   */
  async getExerciseSetById(req, res) {
    try {
      const { id } = req.params;

      const exerciseSet = await ExerciseSet.findByPk(id);
      if (!exerciseSet) {
        return res.status(404).json({
          success: false,
          message: 'Подход не найден',
        });
      }

      return res.status(200).json({
        success: true,
        data: exerciseSet,
      });
    } catch (error) {
      console.error('Ошибка при получении подхода:', error);
      return res.status(500).json({
        success: false,
        message: 'Ошибка при получении подхода',
        error: error.message,
      });
    }
  },

  /**
   * Создание нового подхода
   * @param {Object} req - Запрос
   * @param {Object} res - Ответ
   */
  async createExerciseSet(req, res) {
    try {
      const { exerciseOfTrainingId } = req.params;
      const {
        setNumber,
        actualWeight,
        actualReps,
        isCompleted,
        notes,
        executionDate,
        executionTime,
      } = req.body;

      // Проверяем существование упражнения в тренировке
      const exerciseOfTraining = await ExerciseOfTraining.findByPk(exerciseOfTrainingId);
      if (!exerciseOfTraining) {
        return res.status(404).json({
          success: false,
          message: 'Упражнение в тренировке не найдено',
        });
      }

      // Проверяем, не существует ли уже подход с таким номером
      const existingSet = await ExerciseSet.findOne({
        where: { exerciseOfTrainingId, setNumber },
      });

      if (existingSet) {
        return res.status(400).json({
          success: false,
          message: 'Подход с таким номером уже существует',
        });
      }

      // Создаем новый подход
      const exerciseSet = await ExerciseSet.create({
        exerciseOfTrainingId,
        setNumber,
        actualWeight,
        actualReps,
        isCompleted: isCompleted || false,
        notes,
        executionDate,
        executionTime,
      });

      return res.status(201).json({
        success: true,
        message: 'Подход успешно создан',
        data: exerciseSet,
      });
    } catch (error) {
      console.error('Ошибка при создании подхода:', error);
      return res.status(500).json({
        success: false,
        message: 'Ошибка при создании подхода',
        error: error.message,
      });
    }
  },

  /**
   * Обновление подхода
   * @param {Object} req - Запрос
   * @param {Object} res - Ответ
   */
  async updateExerciseSet(req, res) {
    try {
      const { id } = req.params;
      const {
        actualWeight,
        actualReps,
        isCompleted,
        notes,
        executionDate,
        executionTime,
      } = req.body;

      // Проверяем существование подхода
      const exerciseSet = await ExerciseSet.findByPk(id);
      if (!exerciseSet) {
        return res.status(404).json({
          success: false,
          message: 'Подход не найден',
        });
      }

      // Обновляем подход
      await exerciseSet.update({
        actualWeight,
        actualReps,
        isCompleted,
        notes,
        executionDate,
        executionTime,
      });

      return res.status(200).json({
        success: true,
        message: 'Подход успешно обновлен',
        data: exerciseSet,
      });
    } catch (error) {
      console.error('Ошибка при обновлении подхода:', error);
      return res.status(500).json({
        success: false,
        message: 'Ошибка при обновлении подхода',
        error: error.message,
      });
    }
  },

  /**
   * Удаление подхода
   * @param {Object} req - Запрос
   * @param {Object} res - Ответ
   */
  async deleteExerciseSet(req, res) {
    try {
      const { id } = req.params;

      // Проверяем существование подхода
      const exerciseSet = await ExerciseSet.findByPk(id);
      if (!exerciseSet) {
        return res.status(404).json({
          success: false,
          message: 'Подход не найден',
        });
      }

      // Удаляем подход
      await exerciseSet.destroy();

      return res.status(200).json({
        success: true,
        message: 'Подход успешно удален',
      });
    } catch (error) {
      console.error('Ошибка при удалении подхода:', error);
      return res.status(500).json({
        success: false,
        message: 'Ошибка при удалении подхода',
        error: error.message,
      });
    }
  },

  /**
   * Создание нескольких подходов для упражнения
   * @param {Object} req - Запрос
   * @param {Object} res - Ответ
   */
  async createMultipleExerciseSets(req, res) {
    try {
      const { exerciseOfTrainingId } = req.params;
      const { sets } = req.body;

      // Проверяем существование упражнения в тренировке
      const exerciseOfTraining = await ExerciseOfTraining.findByPk(exerciseOfTrainingId);
      if (!exerciseOfTraining) {
        return res.status(404).json({
          success: false,
          message: 'Упражнение в тренировке не найдено',
        });
      }

      // Проверяем, что sets - это массив
      if (!Array.isArray(sets)) {
        return res.status(400).json({
          success: false,
          message: 'Необходимо передать массив подходов',
        });
      }

      // Создаем подходы
      const createdSets = await Promise.all(
        sets.map(async (set) => {
          const {
            setNumber,
            actualWeight,
            actualReps,
            isCompleted,
            notes,
            executionDate,
            executionTime,
          } = set;

          // Проверяем, не существует ли уже подход с таким номером
          const existingSet = await ExerciseSet.findOne({
            where: { exerciseOfTrainingId, setNumber },
          });

          if (existingSet) {
            // Если подход существует, обновляем его
            await existingSet.update({
              actualWeight,
              actualReps,
              isCompleted: isCompleted || false,
              notes,
              executionDate,
              executionTime,
            });
            return existingSet;
          } else {
            // Если подхода нет, создаем новый
            return await ExerciseSet.create({
              exerciseOfTrainingId,
              setNumber,
              actualWeight,
              actualReps,
              isCompleted: isCompleted || false,
              notes,
              executionDate,
              executionTime,
            });
          }
        }),
      );

      return res.status(201).json({
        success: true,
        message: 'Подходы успешно созданы/обновлены',
        data: createdSets,
      });
    } catch (error) {
      console.error('Ошибка при создании подходов:', error);
      return res.status(500).json({
        success: false,
        message: 'Ошибка при создании подходов',
        error: error.message,
      });
    }
  },
};

module.exports = ExerciseSetController;

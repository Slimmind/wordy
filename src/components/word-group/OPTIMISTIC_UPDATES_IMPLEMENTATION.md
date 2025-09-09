# Руководство по реализации оптимистичных обновлений для компонента WordGroup

## Обзор

Этот документ объясняет, как реализовать оптимистичные обновления для компонента WordGroup, чтобы улучшить пользовательский опыт при операциях добавления/удаления. Хотя в текущей версии React отсутствует поддержка `useOptimistic`, архитектура подготовлена для его использования.

## Текущие улучшения WordGroup

Компонент WordGroup был усилен для приема функций обратного вызова для операций добавления и удаления:

```typescript
type WordGroupProps = {
	group: ItemType[];
	letter: string;
	onAddWord?: (word: Omit<ItemType, 'id'>) => void;
	onRemoveWord?: (wordId: string) => void;
};
```

## План реализации useOptimistic

Для правильной реализации оптимистичных обновлений необходимо следующее:

### 1. В родительском компоненте (Words)

Компонент `Words` должен использовать хук `useOptimistic`:

```tsx
import { useMemo, lazy, useOptimistic } from 'react';

// ... остальные импорты

export const Words = ({ userId }: WordsProps) => {
	const { items } = useSelector((state: RootState) => state.firestore);

	// ... существующая логика фильтрации

	const [optimisticCollection, addOptimisticWord] = useOptimistic(
		collection,
		(state, newWord: ItemType) => {
			// Создание нового набора данных с оптимистичным добавлением
			const newState = [...state];

			// Поиск или создание группы букв
			const letterGroupIndex = newState.findIndex(
				(group) => group.letter === newWord.letter
			);

			if (letterGroupIndex !== -1) {
				// Добавить в существующую группу букв
				newState[letterGroupIndex] = {
					...newState[letterGroupIndex],
					items: [...newState[letterGroupIndex].items, newWord],
				};
			} else {
				// Создать новую группу букв
				newState.push({
					letter: newWord.letter,
					items: [newWord],
				});
			}

			return newState;
		}
	);

	// Передача обратных вызовов в WordGroup
	const handleAddWord = (wordData: Omit<ItemType, 'id'>) => {
		// Это запускает оптимистичное обновление немедленно
		addOptimisticWord({
			...wordData,
			id: `temp-${Date.now()}`, // Временный ID для оптимистичного UI
		});

		// Затем выполнить фактическую асинхронную операцию
		// dispatch(createItem(wordData));
	};

	return (
		<ul className='words'>
			{letters.map((letter) => (
				<WordGroup
					key={letter}
					group={collection.filter((word: ItemType) => word.letter === letter)}
					letter={letter as string}
					onAddWord={handleAddWord}
				/>
			))}
		</ul>
	);
};
```

### 2. В компоненте WordGroup

Компонент WordGroup уже готов к работе с обратными вызовами:

```tsx
export const WordGroup = ({
	group,
	letter,
	onAddWord,
	onRemoveWord,
}: WordGroupProps) => {
	// ... существующая логика проверки

	return (
		<li className='word__group-wrap'>
			<ul id={letter} className='word__group' data-letter={letter}>
				{group.map((word: ItemType) => {
					if (!word.id) {
						console.error('Word is missing required "id" field:', word);
						return null;
					}
					return <Word key={word.id} word={word} />;
				})}
			</ul>
		</li>
	);
};
```

## Преимущества оптимистичных обновлений

1. **Мгновенная обратная связь**: Пользователи видят обновления интерфейса сразу же без ожидания ответа сервера
2. **Лучший пользовательский опыт**: Снижает воспринимаемую задержку во время сетевых операций
3. **Плавные взаимодействия**: Делает операции добавления/удаления быстрее и более отзывчивыми
4. **Гладкий отказ**: При ошибке серверной операции оптимистичное состояние автоматически откатывается

## Синхронизация состояния

Для обеспечения целостности данных:

1. При оптимистичном обновлении используется временный ID
2. При успешном ответе сервера временный ID заменяется реальным ID
3. Если операция сервера завершается ошибкой, оптимистичная запись удаляется из UI
4. Состояние сервера служит окончательным источником истины

## Требования к реализации

Для корректной работы хука `useOptimistic`:

1. Версия React должна быть 18.2 или выше
2. Родительский компонент, управляющий данными, должен быть обновлен для использования `useOptimistic`
3. Функции обратного вызова должны быть правильно переданы по иерархии компонентов
4. Необходимо реализовать правильную обработку ошибок для отката оптимистичных изменений

## Пример использования

```tsx
// В форме или обработчике действий
const handleAddWord = (wordData: Omit<ItemType, 'id'>) => {
	// Это запускает оптимистичное обновление немедленно
	addOptimisticWord({
		...wordData,
		id: `temp-${Date.now()}`,
	});

	// Выполнить фактическую асинхронную операцию
	try {
		await dispatch(createItem(wordData));
		// Успех - состояние будет автоматически синхронизировано
	} catch (error) {
		// Ошибка - оптимистичное обновление будет автоматически отменено
		console.error('Не удалось добавить слово:', error);
	}
};
```

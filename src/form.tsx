import z from 'zod';
import { revalidateLogic, useForm } from '@tanstack/react-form';

const signupSchema = z.object({
  name: z
    .string('Name should be valid.')
    .nonempty('Name is required.')
    .trim()
    .toLowerCase(),
  email: z.email('Email should be valid.').trim().toLowerCase(),
  password: z
    .string('Password should be valid.')
    .nonempty('Password is required.')
    .min(8, 'Password must be at least 8 characters long.')
    .max(256, 'Password must be at most 256 characters long.')
    .regex(/[0-9]/, 'Password must contain at least one number.')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter.')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter.')
    .regex(
      /[^A-Za-z0-9]/,
      'Password must contain at least one special character.',
    )
    .trim(),
  image: z
    .union([
      z.string('File should be valid.').trim().toLowerCase(),
      z
        .file('File should be valid.')
        .min(10_000, 'File should be atleast 10 bytes.')
        .max(1_000_000, 'File shold be atmost 1 Megabyte.')
        .mime(['image/png', 'image/jpeg'], 'File should be in ".png" format.'),
    ])
    .transform(val => val || undefined)
    .optional(),
  hobbies: z
    .array(
      z.object({
        title: z
          .string('Title should be valid.')
          .nonempty('Title is required.')
          .trim()
          .toLowerCase(),
        description: z
          .string('Description should be valid.')
          .nonempty('Description is required.')
          .trim()
          .toLowerCase(),
      }),
    )
    .transform(val => (val && val.length ? val : undefined))
    .optional(),
});

type User = z.infer<typeof signupSchema>;

export default function App() {
  const form = useForm({
    validationLogic: revalidateLogic(),
    validators: { onDynamic: signupSchema },
    defaultValues: { name: '', email: '', password: '', hobbies: [] } as User,
    onSubmit({ value }) {
      console.log(signupSchema.parse(value));
    },
  });

  return (
    <main className="min-h-screen content-center justify-items-center">
      <form
        className="min-w-sm border rounded p-4 grid gap-2"
        onSubmit={e => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className="grid">
          <h1 className="font-bold text-lg">Create Account</h1>
          <span>Fill account details to create your account.</span>
        </div>
        <form.Field
          name="name"
          children={field => (
            <div className="grid gap-1">
              <label htmlFor={field.name}>Name</label>
              <input
                type="text"
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                placeholder="Gwen Tennyson"
                className={`${!field.state.meta.isValid ? 'outline-red-500 outline' : 'outline'} px-2 py-1 rounded`}
                onChange={e => field.handleChange(e.target.value)}
              />
              {!field.state.meta.isValid && (
                <ul>
                  {field.state.meta.errors.map((e, i) => (
                    <li key={i} className="text-red-500 text-sm">
                      {e?.message}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        />
        <form.Field
          name="email"
          validators={{
            onDynamicAsyncDebounceMs: 300,
            async onDynamicAsync({ value }) {
              const result = signupSchema.shape.email.safeParse(value);
              if (!result.success) return;

              await new Promise(resolve => setTimeout(resolve, 1000));

              if (value.includes('error')) {
                return {
                  path: ['email'],
                  message: 'Email should not contain "error".',
                };
              }
            },
          }}
          children={field => (
            <div className="grid gap-1">
              <label htmlFor={field.name}>Email</label>
              <input
                type="email"
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                placeholder="gwen@cn.com"
                className={`${!field.state.meta.isValid ? 'outline-red-500 outline' : 'outline'} px-2 py-1 rounded`}
                onChange={e => field.handleChange(e.target.value)}
              />
              {field.state.meta.isValidating && <span>Validating...</span>}
              {!field.state.meta.isValid && (
                <ul>
                  {field.state.meta.errors.map((e, i) => (
                    <li key={i} className="text-red-500 text-sm">
                      {e?.message}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        />
        <form.Field
          name="password"
          children={field => (
            <div className="grid gap-1">
              <label htmlFor={field.name}>Password</label>
              <input
                type="password"
                id={field.name}
                name={field.name}
                placeholder="Secret@123"
                value={field.state.value}
                onBlur={field.handleBlur}
                className={`${!field.state.meta.isValid ? 'outline-red-500 outline' : 'outline'} px-2 py-1 rounded`}
                onChange={e => field.handleChange(e.target.value)}
              />
              {!field.state.meta.isValid && (
                <ul>
                  {field.state.meta.errors.map((e, i) => (
                    <li key={i} className="text-red-500 text-sm">
                      {e?.message}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        />
        <form.Field
          name="image"
          children={field => (
            <div className="grid gap-1">
              <label htmlFor={field.name}>Profile Picture</label>
              <input
                type="file"
                id={field.name}
                name={field.name}
                onBlur={field.handleBlur}
                multiple
                className="outline px-2 py-1 rounded cursor-pointer"
                onChange={e =>
                  field.handleChange(
                    e.target.files && e.target.files.length
                      ? e.target.files[0]
                      : undefined,
                  )
                }
              />
              {!field.state.meta.isValid && (
                <ul>
                  {field.state.meta.errors.map((e, i) => (
                    <li key={i} className="text-red-500 text-sm">
                      {e?.message}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        />
        <form.Field
          mode="array"
          name="hobbies"
          children={field => {
            return (
              <div className="grid gap-2">
                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <div>
                    <h2 className="font-semibold text-sm-">Hobbies</h2>
                    <em className="text-sm">Add your hobbies</em>
                  </div>
                  <button
                    type="button"
                    className="text-xs border rounded py-1 px-2 self-start cursor-pointer"
                    onClick={() =>
                      field.pushValue({ title: '', description: '' })
                    }
                  >
                    Add hobby
                  </button>
                </div>
                {field.state.value && field.state.value.length > 0 && (
                  <ul className="grid gap-3">
                    {field.state.value.map((_, i) => {
                      return (
                        <li
                          key={i}
                          className="relative grid gap-2 grid-cols-2 items-start"
                        >
                          <form.Field
                            name={`hobbies[${i}].title`}
                            children={subField => {
                              return (
                                <div className="grid gap-1">
                                  <label htmlFor={`hobbies[${i}].title`}>
                                    Title
                                  </label>
                                  <input
                                    placeholder="Programming"
                                    id={`hobbies[${i}].title`}
                                    value={subField.state.value}
                                    className={`${!field.state.meta.isValid ? 'outline-red-500 outline' : 'outline'} px-2 py-1 rounded`}
                                    onChange={e =>
                                      subField.handleChange(e.target.value)
                                    }
                                  />
                                  {!subField.state.meta.isValid && (
                                    <ul>
                                      {subField.state.meta.errors.map(
                                        (e, i) => (
                                          <li
                                            key={i}
                                            className="text-red-500 text-sm"
                                          >
                                            {e?.message}
                                          </li>
                                        ),
                                      )}
                                    </ul>
                                  )}
                                </div>
                              );
                            }}
                          />
                          <form.Field
                            name={`hobbies[${i}].description`}
                            children={subField => {
                              return (
                                <div className="grid gap-1">
                                  <label htmlFor={`hobbies[${i}].description`}>
                                    Description
                                  </label>
                                  <input
                                    value={subField.state.value}
                                    id={`hobbies[${i}].description`}
                                    className={`${!field.state.meta.isValid ? 'outline-red-500 outline' : 'outline'} px-2 py-1 rounded`}
                                    placeholder="Creating web applications..."
                                    onChange={e =>
                                      subField.handleChange(e.target.value)
                                    }
                                  />
                                  {!subField.state.meta.isValid && (
                                    <ul>
                                      {subField.state.meta.errors.map(
                                        (e, i) => (
                                          <li
                                            key={i}
                                            className="text-red-500 text-sm"
                                          >
                                            {e?.message}
                                          </li>
                                        ),
                                      )}
                                    </ul>
                                  )}
                                </div>
                              );
                            }}
                          />
                          <button
                            type="button"
                            className="text-xs border rounded py-1 px-2 cursor-pointer absolute -top-1 -right-1"
                            onClick={() => field.removeValue(i)}
                          >
                            Remove
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          }}
        />
        <form.Subscribe
          selector={state => state.isSubmitting}
          children={isSubmitting => (
            <button
              disabled={isSubmitting}
              className="border rounded mt-4 py-1 cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting ? '...' : 'Submit'}
            </button>
          )}
        />
      </form>
    </main>
  );
}

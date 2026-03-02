async authorize(credentials) {
  try {
    const validatedField = SignInSchema.safeParse(credentials);
    console.log("PROD 1 →", validatedField.success);

    if (validatedField.success) {
      const { email, password } = validatedField.data;

      const accountRes = await api.accounts.getByProvider(email) as ActionResponse<IAccountDoc>;
      console.log("PROD 2 →", JSON.stringify(accountRes));

      if (!accountRes.data) return null;

      const userRes = await api.users.getById(accountRes.data.userId.toString()) as ActionResponse<any>;
      console.log("PROD 3 →", JSON.stringify(userRes));

      if (!userRes.data) return null;

      const isValid = await bcrypt.compare(password, accountRes.data.password!);
      console.log("PROD 4 →", isValid);

      if (isValid) return {
        id: accountRes.data.userId.toString(),
        name: userRes.data.name,
        email: userRes.data.email,
        image: userRes.data.image,
      };
    }
  } catch(e) {
    console.error("PROD ERROR →", e); // 👈 real error shows here
  }
  return null;
}